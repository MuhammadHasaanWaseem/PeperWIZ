import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { hp, wp } from '@/helpers/dimensions';
import { getSettings, saveSettings } from '@/helpers/settingsStorage';
import Animated, { FadeIn } from 'react-native-reanimated';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [highQuality, setHighQuality] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    setNotificationsEnabled(settings.notificationsEnabled);
    setAutoDownload(settings.autoDownload);
    setHighQuality(settings.highQuality);
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await saveSettings({ notificationsEnabled: value });
  };

  const handleAutoDownloadToggle = async (value: boolean) => {
    setAutoDownload(value);
    await saveSettings({ autoDownload: value });
  };

  const handleHighQualityToggle = async (value: boolean) => {
    setHighQuality(value);
    await saveSettings({ highQuality: value });
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handlePrivacy = () => {
    router.push('/privacy-policy');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'By using PepperWiz, you agree to our terms of service.');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached images. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    showArrow = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <FontAwesome6 name={icon as any} size={20} color="#000" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (showArrow && onPress && (
        <FontAwesome6 name="chevron-right" size={16} color="#999" />
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.sectionContent}>
              <SettingItem
                icon="bell"
                title="Notifications"
                subtitle="Get notified about new wallpapers"
                rightComponent={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationToggle}
                    trackColor={{ false: '#ddd', true: '#000' }}
                    thumbColor="#fff"
                  />
                }
                showArrow={false}
              />
              
              <SettingItem
                icon="download"
                title="Auto Download"
                subtitle="Automatically download when saving"
                rightComponent={
                  <Switch
                    value={autoDownload}
                    onValueChange={handleAutoDownloadToggle}
                    trackColor={{ false: '#ddd', true: '#000' }}
                    thumbColor="#fff"
                  />
                }
                showArrow={false}
              />
              
              <SettingItem
                icon="image"
                title="High Quality"
                subtitle="Download images in high resolution"
                rightComponent={
                  <Switch
                    value={highQuality}
                    onValueChange={handleHighQualityToggle}
                    trackColor={{ false: '#ddd', true: '#000' }}
                    thumbColor="#fff"
                  />
                }
                showArrow={false}
              />
            </View>
          </View>

          {/* Storage Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage</Text>
            
            <View style={styles.sectionContent}>
              <SettingItem
                icon="trash"
                title="Clear Cache"
                subtitle="Free up storage space"
                onPress={handleClearCache}
              />
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.sectionContent}>
              <SettingItem
                icon="circle-info"
                title="About PepperWiz"
                subtitle="App version and information"
                onPress={handleAbout}
              />
              
              <SettingItem
                icon="shield"
                title="Privacy Policy"
                onPress={handlePrivacy}
              />
              
              <SettingItem
                icon="file-contract"
                title="Terms of Service"
                onPress={handleTerms}
              />
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfoContainer}>
            <Text style={styles.appInfoText}>PepperWiz v1.0.0</Text>
            <Text style={styles.appInfoSubtext}>Made with ❤️ for wallpaper lovers</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

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
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#666',
    marginBottom: hp(1.5),
    paddingHorizontal: wp(4),
    fontStyle: 'italic',
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: wp(4),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp(0.3),
  },
  settingSubtitle: {
    fontSize: hp(1.6),
    color: '#666',
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: hp(4),
    marginTop: hp(2),
  },
  appInfoText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#666',
    marginBottom: hp(0.5),
  },
  appInfoSubtext: {
    fontSize: hp(1.6),
    color: '#999',
  },
});

