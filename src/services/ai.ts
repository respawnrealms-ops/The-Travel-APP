export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const customReplies: { keywords: string[]; text: string }[] = [
  {
    keywords: ['paris', 'france', 'eiffel'],
    text: `### 🗼 Bienvenue à Paris!
Here is a premium AI curated itinerary for your Paris adventure:

*   **Day 1: Classic Parisian Marvels**
    *   **Morning (09:00 AM)**: Ascend the **Eiffel Tower** for breath-taking panoramic views of the city before the crowds arrive.
    *   **Afternoon (01:00 PM)**: Stroll along the Seine towards the **Louvre Museum**. Grab a quick espresso at *Café Marly* overlooking the glass pyramid.
    *   **Evening (07:00 PM)**: Dine at *Le Comptoir de La Relais* in Saint-Germain-des-Prés for authentic, elevated bistro fare.

*   **Day 2: Bohemian Art & Spontaneity**
    *   **Morning (10:00 AM)**: Explore the cobbled streets of **Montmartre** and step inside the stunning Sacré-Cœur Basilica.
    *   **Afternoon (02:30 PM)**: Shop along the Le Marais neighborhood, famous for its avant-garde boutiques and historic squares.
    *   **Evening (08:30 PM)**: Live jazz performance at *Le Caveau de la Huchette*.

**AI Tip**: Buy a *Paris Museum Pass* ahead of time to skip the queues! 🎟️`
  },
  {
    keywords: ['tokyo', 'japan', 'shibuya'],
    text: `### 🇯🇵 Welcome to Tokyo!
A perfect balance of ancient tradition and futuristic marvels:

*   **Day 1: High-Tech Shibuya & Harajuku**
    *   **Morning (09:30 AM)**: Experience the energetic **Shibuya Crossing**. View it from the glass-walled observatory at *Shibuya Sky*.
    *   **Afternoon (01:00 PM)**: Wander down Takeshita Street in **Harajuku** for crazy street food, then find peace in the forested grounds of **Meiji Shrine**.
    *   **Evening (07:00 PM)**: Slurp award-winning Michelin-star ramen at *Tsuta* or explore the cozy alleyways of Omoide Yokocho.

*   **Day 2: Traditional Asakusa & Akihabara**
    *   **Morning (09:00 AM)**: Walk under the massive red lantern of **Senso-ji Temple** in Asakusa.
    *   **Afternoon (02:00 PM)**: Dive into the electric town of **Akihabara** for retro gaming and anime culture.

**AI Budget Optimization**: Get the 72-hour Tokyo Subway ticket to save up to 40% on daily transport costs! 🎫`
  },
  {
    keywords: ['budget', 'save', 'cost', 'expensive'],
    text: `### 💰 AI Budget Optimizer
Here is how to optimize your travel funds for a luxury experience without the premium price:

1.  **Transport**: Leverage local transit passes (e.g., Navigo in Paris, Pasmo in Tokyo) instead of point-to-point tickets or ride shares.
2.  **Dining**: Eat your main meal during lunch hours. Most premium restaurants offer *Formule Midi* (lunch specials) that cost 50% less than dinner.
3.  **Free Days**: Many world-class museums offer free admission on the first Sunday of every month. Check calendar dates before booking!
4.  **Currency**: Always pay in local currency at POS card terminals rather than letting the machine convert it for you (avoid DCC markups).`
  },
  {
    keywords: ['emergency', 'help', 'lost', 'safety', 'hospital', 'police'],
    text: `### 🚨 AI Travel Emergency Guide
Stay calm. Here are instant actions to secure your situation:

*   **Offline Emergency Numbers**:
    *   **Europe (General)**: Call **112** (Works even without a SIM card!)
    *   **Japan**: Call **110** (Police) or **119** (Fire/Ambulance)
    *   **USA**: Call **911**
*   **Lost Passport**:
    1.  Go online and locate the nearest consulate/embassy of your home country.
    2.  Use the **Documents** tab in this app. Your encrypted passport backup remains readable offline.
    3.  File a report at the local police station immediately to acquire a physical copy of the statement.
*   **Medical Emergency**: Navigate to the closest Public Hospital. They are legally required to stabilize patients regardless of insurance credentials. Check your digital vault folder for your *Insurance Policy* details.`
  },
  {
    keywords: ['pack', 'bag', 'luggage', 'clothing'],
    text: `### 🎒 AI Packing Suggestion
Based on a typical 7-day trip with shifting conditions:

*   **Core Essentials**:
    *   3x Breathable layers (Merino wool recommended)
    *   1x Weatherproof outer shell jacket
    *   2x Durable travel trousers
    *   1x Smart-casual evening outfit
    *   1x Super-comfortable walking shoes (don't break in new shoes on the trip!)
*   **Smart Travel Items**:
    *   Universal travel adapter plug
    *   Ultra-thin 10,000mAh power bank
    *   Noise-cancelling earbuds (crucial for flights)
    *   Compact, reusable water bottle

*Weather Aware Note*: Paris and New York are showing rain forecasts. Ensure an umbrella is in your daypack! ☔`
  }
];

export const aiService = {
  sendMessage: async (userText: string): Promise<string> => {
    const apiKey = "gsk_...CEfN"; // Groq API Key
    const model = "llama3-8b-8192";

    // Dynamic API call
    if (apiKey && !apiKey.includes("...") && apiKey.startsWith("gsk_")) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content: "You are a premium, Apple-designed travel companion AI assistant. Give highly styled, concise, and structured travel advice in Markdown. Use emojis, clear bullet points, and highlight best options."
              },
              {
                role: "user",
                content: userText
              }
            ],
            temperature: 0.7,
            max_tokens: 1024
          })
        });

        if (response.ok) {
          const json = await response.json();
          const aiResponse = json?.choices?.[0]?.message?.content;
          if (aiResponse) return aiResponse;
        }
      } catch (e) {
        console.warn("Groq API error, falling back to local response: ", e);
      }
    }

    // Local / Offline Smart Fallback Database
    await new Promise(resolve => setTimeout(resolve, 1200));
    const textLower = userText.toLowerCase();
    
    for (const reply of customReplies) {
      for (const keyword of reply.keywords) {
        if (textLower.includes(keyword)) {
          return reply.text;
        }
      }
    }

    return `### 🗺️ AI Travel Companion
I'm here to help you plan your journey. Ask me about:
*   Detailed itineraries for **Paris** or **Tokyo**
*   **Budget** optimization tips
*   **Packing** suggestions
*   What to do in an **emergency**

*Example*: "What should I pack for a rainy trip?" or "Tell me about things to do in Paris."`;
  },

  getOfflineTips: (city: string): string[] => {
    if (city.toLowerCase().includes('paris')) {
      return [
        'Metro tickets are moving fully digital; download the Île-de-France Mobilités app.',
        'Water fountains in Paris (Wallace Fountains) offer clean, cold drinking water for free.',
        'Tipping is not required in France; a 15% service charge is already included in the bill.',
      ];
    }
    if (city.toLowerCase().includes('tokyo')) {
      return [
        'Many traditional restaurants only accept cash (Yen). Keep at least ¥5,000 in your wallet.',
        'Trash cans are extremely rare in public spaces. Carry a small plastic bag to store your garbage.',
        'Keep left on escalators in Tokyo (but keep right in Osaka!).',
      ];
    }
    return [
      'Download offline Google Maps for your destination to navigate without mobile data.',
      'Take a photo of your physical accommodation address and room card.',
      'Check local taxi app alternatives (e.g., Grab, Uber, Gojek, Taxi.eu) before landing.',
    ];
  }
};
