import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const FAVORITES_KEY = 'pepperwiz_favorites';

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

export const saveFavorite = async (image: any) => {
  try {
    const favorites = await getFavorites();
    const imageId = image.id || image.webformatURL || image.largeImageURL;
    
    // Check if already exists
    const exists = favorites.some((fav: any) => {
      const favId = fav.id || fav.webformatURL || fav.largeImageURL;
      return favId === imageId;
    });
    
    if (!exists) {
      const newFavorites = [...favorites, { ...image, favoritedAt: new Date().toISOString() }];
      await storage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving favorite:', error);
    return false;
  }
};

export const removeFavorite = async (image: any) => {
  try {
    const favorites = await getFavorites();
    const imageId = image.id || image.webformatURL || image.largeImageURL;
    
    const newFavorites = favorites.filter((fav: any) => {
      const favId = fav.id || fav.webformatURL || fav.largeImageURL;
      return favId !== imageId;
    });
    
    await storage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

export const getFavorites = async (): Promise<any[]> => {
  try {
    const data = await storage.getItem(FAVORITES_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const isFavorite = async (image: any): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const imageId = image.id || image.webformatURL || image.largeImageURL;
    
    return favorites.some((fav: any) => {
      const favId = fav.id || fav.webformatURL || fav.largeImageURL;
      return favId === imageId;
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

export const clearAllFavorites = async () => {
  try {
    await storage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};

