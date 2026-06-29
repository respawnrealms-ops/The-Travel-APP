import { Platform } from 'react-native';

class MMKVWebFallback {
  getItem(key: string): string | null {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  }
  setItem(key: string, value: string): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  }
  removeItem(key: string): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }
}

let nativeStorage: any = null;

if (Platform.OS !== 'web') {
  try {
    const { MMKV } = require('react-native-mmkv');
    nativeStorage = new MMKV();
  } catch (e) {
    console.warn('Failed to initialize MMKV, using fallback', e);
  }
}

const webStorage = new MMKVWebFallback();

export const database = {
  getString: (key: string): string | undefined => {
    if (Platform.OS === 'web' || !nativeStorage) {
      return webStorage.getItem(key) ?? undefined;
    }
    return nativeStorage.getString(key);
  },

  setString: (key: string, value: string): void => {
    if (Platform.OS === 'web' || !nativeStorage) {
      webStorage.setItem(key, value);
    } else {
      nativeStorage.set(key, value);
    }
  },

  getNumber: (key: string): number | undefined => {
    if (Platform.OS === 'web' || !nativeStorage) {
      const val = webStorage.getItem(key);
      return val ? Number(val) : undefined;
    }
    return nativeStorage.getNumber(key);
  },

  setNumber: (key: string, value: number): void => {
    if (Platform.OS === 'web' || !nativeStorage) {
      webStorage.setItem(key, String(value));
    } else {
      nativeStorage.set(key, value);
    }
  },

  getBoolean: (key: string): boolean | undefined => {
    if (Platform.OS === 'web' || !nativeStorage) {
      const val = webStorage.getItem(key);
      return val ? val === 'true' : undefined;
    }
    return nativeStorage.getBoolean(key);
  },

  setBoolean: (key: string, value: boolean): void => {
    if (Platform.OS === 'web' || !nativeStorage) {
      webStorage.setItem(key, String(value));
    } else {
      nativeStorage.set(key, value);
    }
  },

  delete: (key: string): void => {
    if (Platform.OS === 'web' || !nativeStorage) {
      webStorage.removeItem(key);
    } else {
      nativeStorage.delete(key);
    }
  },

  clearAll: (): void => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.clear();
    } else if (nativeStorage) {
      nativeStorage.clearAll();
    }
  }
};
