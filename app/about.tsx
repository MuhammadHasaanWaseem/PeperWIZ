import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { hp, wp } from '@/helpers/dimensions';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';

const AboutScreen = () => {
  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your interest! Rating feature coming soon.');
  };

  const handleShareApp = async () => {
    try {
      await Linking.openURL('https://pepperwiz.app');
    } catch (error) {
      console.error('Error sharing app:', error);
    }
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
          <Text style={styles.headerTitle}>About</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          {/* App Logo and Name */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/Appicon.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>Pepper</Text>
              <Text style={styles.logoText2}>Wiz</Text>
            </View>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              PepperWiz is your ultimate destination for discovering and collecting beautiful wallpapers. 
              It's not just an Art Gallery, it's your silent expression.
            </Text>
            <Text style={styles.descriptionText}>
              Browse through thousands of high-quality images, search by categories, and save your favorites 
              to create your personal collection.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <FontAwesome6 name="check-circle" size={20} color="#000" />
                <Text style={styles.featureText}>Browse thousands of wallpapers</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome6 name="check-circle" size={20} color="#000" />
                <Text style={styles.featureText}>AI-powered image search</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome6 name="check-circle" size={20} color="#000" />
                <Text style={styles.featureText}>Save your favorites</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome6 name="check-circle" size={20} color="#000" />
                <Text style={styles.featureText}>Advanced filters and categories</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome6 name="check-circle" size={20} color="#000" />
                <Text style={styles.featureText}>High-quality downloads</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleRateApp}>
              <FontAwesome6 name="star" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Rate App</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonSecondary]} 
              onPress={handleShareApp}
            >
              <FontAwesome6 name="share" size={20} color="#000" />
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Share App</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ for wallpaper lovers</Text>
            <Text style={styles.footerSubtext}>© 2024 PepperWiz. All rights reserved.</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

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
  content: {
    paddingBottom: hp(6),
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: hp(4),
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: hp(2),
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  logoText: {
    fontSize: hp(3.5),
    fontWeight: '900',
    color: 'grey',
    fontStyle: 'italic',
  },
  logoText2: {
    fontSize: hp(3.5),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  versionText: {
    fontSize: hp(1.6),
    color: '#666',
    fontWeight: '600',
  },
  descriptionContainer: {
    paddingHorizontal: wp(6),
    marginBottom: hp(4),
  },
  descriptionText: {
    fontSize: hp(1.8),
    color: '#666',
    lineHeight: hp(2.8),
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: wp(4),
    marginBottom: hp(4),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    marginBottom: hp(2),
    fontStyle: 'italic',
  },
  featuresList: {
    gap: hp(1.5),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    paddingVertical: hp(1),
  },
  featureText: {
    fontSize: hp(1.8),
    color: '#666',
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: wp(4),
    gap: hp(2),
    marginBottom: hp(4),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    backgroundColor: '#000',
    paddingVertical: hp(2),
    borderRadius: 18,
  },
  actionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
  actionButtonTextSecondary: {
    color: '#000',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: hp(4),
    paddingHorizontal: wp(4),
  },
  footerText: {
    fontSize: hp(1.8),
    color: '#666',
    marginBottom: hp(0.5),
  },
  footerSubtext: {
    fontSize: hp(1.6),
    color: '#999',
  },
});

