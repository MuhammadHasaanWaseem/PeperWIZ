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

const TermsOfServiceScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Terms of Service</Text>
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
              Welcome to PepperWiz. These Terms of Service ("Terms") govern your access to and use of our mobile application. By downloading, installing, or using PepperWiz, you agree to be bound by these Terms.
            </Text>
            <Text style={styles.paragraph}>
              If you do not agree to these Terms, please do not use our application.
            </Text>
          </View>

          {/* Acceptance of Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing or using PepperWiz, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you are using the app on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
            </Text>
          </View>

          {/* Use of Service */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Use of Service</Text>
            <Text style={styles.paragraph}>
              PepperWiz provides a platform for browsing, searching, and downloading images. You agree to use the service only for lawful purposes and in accordance with these Terms.
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• You may not use the app to violate any laws or regulations</Text>
              <Text style={styles.listItem}>• You may not attempt to gain unauthorized access to the app or its systems</Text>
              <Text style={styles.listItem}>• You may not use automated systems to access the app without permission</Text>
              <Text style={styles.listItem}>• You may not interfere with or disrupt the app's functionality</Text>
            </View>
          </View>

          {/* Intellectual Property */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intellectual Property</Text>
            <Text style={styles.paragraph}>
              The PepperWiz application, including its design, features, and content, is protected by copyright and other intellectual property laws. All rights are reserved.
            </Text>
            <Text style={styles.paragraph}>
              Images displayed in the app are sourced from third-party providers (Pixabay, Pexels, Unsplash) and are subject to their respective licenses and terms. You are responsible for ensuring your use of downloaded images complies with applicable licenses and laws.
            </Text>
          </View>

          {/* User Content */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Content</Text>
            <Text style={styles.paragraph}>
              You retain ownership of any content you create or upload through the app. By using the app, you grant us a limited license to use, store, and process your content solely for the purpose of providing the service.
            </Text>
          </View>

          {/* Prohibited Uses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prohibited Uses</Text>
            <Text style={styles.paragraph}>
              You agree not to:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Use the app for any illegal or unauthorized purpose</Text>
              <Text style={styles.listItem}>• Violate any applicable laws or regulations</Text>
              <Text style={styles.listItem}>• Infringe upon the rights of others</Text>
              <Text style={styles.listItem}>• Transmit any harmful code or malware</Text>
              <Text style={styles.listItem}>• Attempt to reverse engineer or decompile the app</Text>
              <Text style={styles.listItem}>• Use the app to harass, abuse, or harm others</Text>
            </View>
          </View>

          {/* Disclaimer of Warranties */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disclaimer of Warranties</Text>
            <Text style={styles.paragraph}>
              PepperWiz is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the app will be uninterrupted, error-free, or free from viruses or other harmful components.
            </Text>
            <Text style={styles.paragraph}>
              We are not responsible for the content, accuracy, or availability of images provided by third-party services.
            </Text>
          </View>

          {/* Limitation of Liability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              To the maximum extent permitted by law, PepperWiz and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the app.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the "Last Updated" date. Your continued use of the app after such changes constitutes acceptance of the new Terms.
            </Text>
          </View>

          {/* Termination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Termination</Text>
            <Text style={styles.paragraph}>
              We reserve the right to terminate or suspend your access to the app at any time, with or without cause or notice, for any reason, including violation of these Terms.
            </Text>
          </View>

          {/* Contact Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms of Service, please contact us:
            </Text>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>Email: muhammadhasaanwaseem@gmail.com</Text>
              <Text style={styles.contactText}>App: PepperWiz</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using PepperWiz, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default TermsOfServiceScreen;

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

