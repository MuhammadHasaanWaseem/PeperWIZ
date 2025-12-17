import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { hp, wp } from '@/helpers/dimensions';
import Animated, { FadeIn } from 'react-native-reanimated';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          {/* Last Updated */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to PepperWiz. We are committed to protecting your privacy and ensuring you have a positive experience while using our application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
            </Text>
            <Text style={styles.paragraph}>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access or use the application.
            </Text>
          </View>

          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            
            <Text style={styles.subsectionTitle}>1. Information You Provide</Text>
            <Text style={styles.paragraph}>
              We may collect information that you voluntarily provide to us when you use our application, including:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Search queries and preferences</Text>
              <Text style={styles.listItem}>• Favorite images you save</Text>
              <Text style={styles.listItem}>• App settings and preferences</Text>
            </View>

            <Text style={styles.subsectionTitle}>2. Automatically Collected Information</Text>
            <Text style={styles.paragraph}>
              When you use our application, we may automatically collect certain information, including:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Device information (device type, operating system)</Text>
              <Text style={styles.listItem}>• Usage data (features used, time spent in app)</Text>
              <Text style={styles.listItem}>• Error logs and crash reports</Text>
            </View>

            <Text style={styles.subsectionTitle}>3. Images and Media</Text>
            <Text style={styles.paragraph}>
              Our application allows you to browse and download images. We do not collect or store the images you view or download. Images are fetched from third-party APIs (Pixabay, Pexels, Unsplash) and are subject to their respective terms and privacy policies.
            </Text>
          </View>

          {/* How We Use Your Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the information we collect to:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Provide, maintain, and improve our services</Text>
              <Text style={styles.listItem}>• Personalize your experience</Text>
              <Text style={styles.listItem}>• Remember your preferences and settings</Text>
              <Text style={styles.listItem}>• Analyze usage patterns to enhance app functionality</Text>
              <Text style={styles.listItem}>• Respond to your inquiries and provide support</Text>
            </View>
          </View>

          {/* Data Storage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Storage</Text>
            <Text style={styles.paragraph}>
              Your data is stored locally on your device. We use AsyncStorage to save your preferences and favorite images. This data remains on your device and is not transmitted to our servers.
            </Text>
            <Text style={styles.paragraph}>
              You can clear your data at any time through the app settings or by uninstalling the application.
            </Text>
          </View>

          {/* Third-Party Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Third-Party Services</Text>
            <Text style={styles.paragraph}>
              Our application uses third-party services that may collect information used to identify you:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• <Text style={styles.bold}>Pixabay API</Text> - For image search and retrieval</Text>
              <Text style={styles.listItem}>• <Text style={styles.bold}>Pexels API</Text> - For additional image sources</Text>
              <Text style={styles.listItem}>• <Text style={styles.bold}>Unsplash API</Text> - For high-quality images</Text>
            </View>
            <Text style={styles.paragraph}>
              These third-party services have their own privacy policies. We encourage you to review their privacy policies to understand how they handle your information.
            </Text>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure.
            </Text>
            <Text style={styles.paragraph}>
              While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </Text>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Access your personal data stored in the app</Text>
              <Text style={styles.listItem}>• Delete your data through app settings</Text>
              <Text style={styles.listItem}>• Clear cache and stored preferences</Text>
              <Text style={styles.listItem}>• Uninstall the app to remove all local data</Text>
            </View>
          </View>

          {/* Children's Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Our application is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </Text>
          </View>

          {/* Changes to Privacy Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
            <Text style={styles.paragraph}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </Text>
            <Text style={styles.paragraph}>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </Text>
          </View>

          {/* Contact Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us:
            </Text>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>Email: muhammadhasaanwaseem@gmail.com</Text>
              <Text style={styles.contactText}>App: PepperWiz</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using PepperWiz, you acknowledge that you have read and understood this Privacy Policy.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

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
  dateContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginBottom: hp(2),
  },
  dateText: {
    fontSize: hp(1.6),
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: wp(4),
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    marginBottom: hp(1.5),
    fontStyle: 'italic',
  },
  subsectionTitle: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#000',
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  paragraph: {
    fontSize: hp(1.8),
    color: '#666',
    lineHeight: hp(2.8),
    marginBottom: hp(1.5),
    textAlign: 'justify',
  },
  listContainer: {
    marginLeft: wp(2),
    marginBottom: hp(1.5),
  },
  listItem: {
    fontSize: hp(1.8),
    color: '#666',
    lineHeight: hp(2.8),
    marginBottom: hp(0.8),
  },
  bold: {
    fontWeight: '700',
    color: '#000',
  },
  contactContainer: {
    marginTop: hp(1),
    padding: wp(4),
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  contactText: {
    fontSize: hp(1.8),
    color: '#000',
    marginBottom: hp(0.5),
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    marginTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: hp(1.8),
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: hp(2.5),
  },
});

