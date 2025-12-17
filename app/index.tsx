import { hp, wp } from '@/helpers/dimensions';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View, Text, Modal, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TERMS_ACCEPTED_KEY = '@pepperwiz_terms_accepted';

const Onboarding = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleStartExploring = async () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }
    await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    router.push('/(tabs)');
  };

  const handleAcceptTerms = async () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    router.push('/(tabs)');
  };

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.container}>
      <Image
        source={require('../assets/onboarding/welcome.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <Animated.View entering={FadeInDown.duration(600)} style={styles.gradient}>
        <LinearGradient
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.6)',
            'rgba(255,255,255,0.8)',
            'white',
          ]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.contentContainer}>
          <Animated.Text entering={FadeInDown.duration(800)} style={styles.title}>
            Pepper Wiz
          </Animated.Text>

          <Animated.Text entering={FadeInDown.duration(800)} style={styles.subtitle}>
            It's not just an Art Gallery, it's your silent expression
          </Animated.Text>

          <Animated.View entering={FadeInDown.duration(800)} style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <FontAwesome6 name="check" size={14} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => setShowTermsModal(true)}
                >
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => {
                    setShowTermsModal(false);
                    router.push('/privacy-policy');
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(800)} style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={handleStartExploring}
              style={[styles.button, !termsAccepted && styles.buttonDisabled]}
              disabled={!termsAccepted}
            >
              <Animated.Text entering={FadeInDown.duration(1000)} style={styles.buttonText}>
                Start Exploring
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms of Service</Text>
              <TouchableOpacity
                onPress={() => setShowTermsModal(false)}
                style={styles.modalCloseButton}
              >
                <FontAwesome6 name="xmark" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Introduction</Text>
                <Text style={styles.modalText}>
                  Welcome to PepperWiz. These Terms of Service ("Terms") govern your access to and use of our mobile application. By downloading, installing, or using PepperWiz, you agree to be bound by these Terms.
                </Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Acceptance of Terms</Text>
                <Text style={styles.modalText}>
                  By accessing or using PepperWiz, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Use of Service</Text>
                <Text style={styles.modalText}>
                  PepperWiz provides a platform for browsing, searching, and downloading images. You agree to use the service only for lawful purposes and in accordance with these Terms.
                </Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Intellectual Property</Text>
                <Text style={styles.modalText}>
                  The PepperWiz application is protected by copyright and other intellectual property laws. Images displayed in the app are sourced from third-party providers and are subject to their respective licenses.
                </Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Contact Us</Text>
                <Text style={styles.modalText}>
                  If you have any questions about these Terms, please contact us at muhammadhasaanwaseem@gmail.com
                </Text>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalDeclineButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={styles.modalDeclineText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAcceptButton}
                onPress={handleAcceptTerms}
              >
                <Text style={styles.modalAcceptText}>Accept & Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: wp(2),
    paddingBottom: hp(6),
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 43,
    fontWeight: '900',
    color: '#333',
    marginBottom: hp(2),
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: hp(5),
    textAlign: 'center',
    paddingHorizontal: wp(10),
  },
  buttonWrapper: {
    width: Platform.select({
      web: '50%',
      default: '70%',
    }),
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: hp(2),
    paddingHorizontal: wp(10),
    borderRadius: 25,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  termsContainer: {
    width: Platform.select({
      web: '50%',
      default: '70%',
    }),
    marginBottom: hp(2),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  termsText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  termsLink: {
    color: '#000',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: hp(85),
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    maxHeight: hp(60),
    paddingHorizontal: wp(4),
  },
  modalSection: {
    marginVertical: hp(2),
  },
  modalSectionTitle: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp(1),
  },
  modalText: {
    fontSize: hp(1.6),
    color: '#666',
    lineHeight: hp(2.4),
    textAlign: 'justify',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    gap: wp(2),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalDeclineButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  modalDeclineText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#000',
  },
  modalAcceptButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  modalAcceptText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#fff',
  },
});
