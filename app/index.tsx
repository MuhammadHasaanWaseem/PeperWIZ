import { hp, wp } from '@/helpers/dimensions';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const Onboarding = () => {
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

          <Animated.View entering={FadeInDown.duration(800)} style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.button}>
              <Animated.Text entering={FadeInDown.duration(1000)} style={styles.buttonText}>
                Start Exploring</Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
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
});
