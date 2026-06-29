import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { LinearGradient } from 'expo-linear-gradient';
import { aiService, ChatMessage } from '@/services/ai';

export default function AIPlannerScreen() {
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'ai',
      text: `### ✈️ Hello, Traveler!
I am your premium AI travel strategist. Ready to design an optimized itinerary?

Choose a suggestion below or type your destination:`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const chips = [
    { label: 'Paris Itinerary 🗼', text: 'Tell me about Paris' },
    { label: 'Tokyo Itinerary ⛩️', text: 'Itinerary for Tokyo' },
    { label: 'Budget Helper 💰', text: 'Give me budget tips' },
    { label: 'Pack Guide 🎒', text: 'What should I pack?' },
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    haptics.selection();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    scrollViewRef.current?.scrollToEnd({ animated: true });

    try {
      const responseText = await aiService.sendMessage(text);
      haptics.success();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      haptics.error();
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleVoicePress = () => {
    haptics.medium();
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSend('What should I pack for Paris?');
    }, 2000);
  };

  const renderTextContent = (text: string) => {
    // Simple custom Markdown rendering parsing headers and list items
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('###')) {
        return (
          <Text key={idx} style={[styles.mdH3, { color: isDark ? '#ffffff' : '#0F62FE' }]}>
            {line.replace('###', '').trim()}
          </Text>
        );
      }
      if (line.startsWith('**') || line.startsWith('*   **')) {
        // Render bold bullet points
        const clean = line.replace(/^\*\s+\*\*/, '').replace(/^\*\*/, '').replace(/\*\*/g, '').trim();
        return (
          <Text key={idx} style={styles.mdBulletBold}>
            • {clean}
          </Text>
        );
      }
      if (line.startsWith('*') || line.startsWith('-')) {
        return (
          <Text key={idx} style={styles.mdBullet}>
            • {line.substring(1).trim()}
          </Text>
        );
      }
      return (
        <Text key={idx} style={styles.mdParagraph}>
          {line}
        </Text>
      );
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}
    >
      {/* Top Title Bar */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <View style={styles.headerDot} />
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>AI TRAVEL PLANNER</Text>
          <Ionicons name="sparkles" size={18} color="#00C6FF" />
        </GlassView>
      </View>

      {/* Chat scroll content */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <Animated.View
              key={msg.id}
              entering={FadeInDown.duration(400)}
              layout={Layout.springify()}
              style={[
                styles.messageRow,
                isAI ? styles.rowAI : styles.rowUser,
              ]}
            >
              {isAI ? (
                <GlassView style={styles.aiBubble} borderRadius={22}>
                  {renderTextContent(msg.text)}
                </GlassView>
              ) : (
                <LinearGradient
                  colors={['#0F62FE', '#00C6FF']}
                  style={styles.userBubble}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.userText}>{msg.text}</Text>
                </LinearGradient>
              )}
            </Animated.View>
          );
        })}

        {isTyping && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
            <GlassView style={styles.typingBubble} borderRadius={18}>
              <ActivityIndicator size="small" color="#0F62FE" />
              <Text style={styles.typingText}>AI is thinking...</Text>
            </GlassView>
          </Animated.View>
        )}
      </ScrollView>

      {/* Suggested Quick Chips */}
      <View style={styles.chipsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {chips.map((chip, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleSend(chip.text)}
              style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}
            >
              <Text style={[styles.chipText, { color: isDark ? '#ffffff' : '#0F62FE' }]}>{chip.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Input bar section */}
      <View style={styles.inputContainer}>
        <GlassView style={styles.inputBlur} borderRadius={24}>
          <Pressable onPress={handleVoicePress} style={styles.actionButton}>
            <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={24} color={isRecording ? '#EF4444' : '#0F62FE'} />
          </Pressable>
          <TextInput
            placeholder={isRecording ? 'Listening...' : 'Ask your AI assistant...'}
            placeholderTextColor={isDark ? '#60646C' : '#90949C'}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={() => handleSend(inputValue)}
            style={[styles.inputField, { color: isDark ? '#ffffff' : '#000000' }]}
            editable={!isRecording}
          />
          <Pressable onPress={() => handleSend(inputValue)} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#ffffff" />
          </Pressable>
        </GlassView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 100,
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 200,
    width: '100%',
  },
  messageRow: {
    flexDirection: 'row',
    width: '100%',
  },
  rowAI: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    maxWidth: '85%',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  userBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 22,
    borderBottomRightRadius: 4,
    shadowColor: '#0F62FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  typingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  typingText: {
    fontSize: 12,
    color: '#60646C',
    fontWeight: '600',
  },
  chipsSection: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 154 : 144,
    left: 0,
    right: 0,
  },
  chipsScroll: {
    paddingHorizontal: 20,
    gap: 8,
    height: 40,
  },
  chip: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  inputContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 80,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  inputBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F62FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Custom Markdown Styles
  mdH3: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  mdParagraph: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#E0E1E6',
    marginBottom: 8,
  },
  mdBullet: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#E0E1E6',
    marginLeft: 12,
    marginBottom: 4,
  },
  mdBulletBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
    marginBottom: 4,
  },
});
