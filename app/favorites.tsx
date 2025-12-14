import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { hp, wp } from '@/helpers/dimensions';
import { Image } from 'expo-image';
import { getFavorites, clearAllFavorites as clearFavorites } from '@/helpers/favoritesStorage';
import Imagegrid from '@/components/Nested Screens/Imagegrid';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

const FavoritesScreen = () => {
  const [favoriteImages, setFavoriteImages] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const favorites = await getFavorites();
      setFavoriteImages(favorites);
      setIsEmpty(favorites.length === 0);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setIsEmpty(true);
    }
  };

  const clearAllFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorite images?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearFavorites();
              setFavoriteImages([]);
              setIsEmpty(true);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
        {!isEmpty && (
          <TouchableOpacity onPress={clearAllFavorites} style={styles.clearButton}>
            <FontAwesome6 name="trash" size={20} color="#000" />
          </TouchableOpacity>
        )}
        {isEmpty && <View style={{ width: 40 }} />}
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isEmpty ? (
          <Animated.View entering={FadeIn.duration(600)} style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <FontAwesome6 name="heart" size={64} color="#ddd" />
            </View>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start exploring and save your favorite wallpapers by tapping the heart icon
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.exploreButtonText}>Explore Images</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(600)}>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {favoriteImages.length} {favoriteImages.length === 1 ? 'Favorite' : 'Favorites'}
              </Text>
            </View>
            <Imagegrid images={favoriteImages} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 20 : wp(4),
    margin: hp(1),
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp(3),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    paddingBottom: hp(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
    paddingVertical: hp(10),
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  emptyTitle: {
    fontSize: hp(2.8),
    fontWeight: '900',
    color: '#000',
    marginBottom: hp(1),
    fontStyle: 'italic',
  },
  emptySubtitle: {
    fontSize: hp(1.8),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(4),
    lineHeight: hp(2.5),
  },
  exploreButton: {
    backgroundColor: '#000',
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: 18,
    marginTop: hp(2),
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
  statsContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginBottom: hp(1),
  },
  statsText: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#666',
    fontStyle: 'italic',
  },
});

