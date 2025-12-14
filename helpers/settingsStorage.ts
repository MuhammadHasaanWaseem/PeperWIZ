import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SETTINGS_KEY = 'pepperwiz_settings';

// Web fallback using localStorage
const getWebStorage = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
    };
  }
  return AsyncStorage;
};

const storage = getWebStorage();

export interface AppSettings {
  notificationsEnabled: boolean;
  autoDownload: boolean;
  highQuality: boolean;
}

const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  autoDownload: false,
  highQuality: true,
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await storage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
    return defaultSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return defaultSettings;
  }
};

export const saveSettings = async (settings: Partial<AppSettings>) => {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...settings };
    await storage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const resetSettings = async () => {
  try {
    await storage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return true;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return false;
  }
};

