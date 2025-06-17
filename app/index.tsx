import { hp, wp } from '@/helpers/dimensions';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const Onboarding = () => {
 

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.container}>
      <Image
        source={require('../assets/onboarding/welcome.png')}
        style={styles.backgroundImage}
        resizeMode='cover'
      />
      <Animated.View  entering={FadeInDown.duration(600)} style={[styles.gradient]}>
        <LinearGradient
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)', 'rgba(255,255,255,0.8)', 'white']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.contentContainer}>
          <Animated.Text entering={FadeInDown.duration(800)} style={[styles.title]}>Peper Wiz</Animated.Text>
          <Animated.Text  entering={FadeInDown.duration(800)}style={[styles.subtitle]}>
            It's not just an Art Gallary, it's your silent expression
          </Animated.Text>
          <Animated.View entering={FadeInDown.duration(800)} style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.button}>
              <Animated.Text entering={FadeInDown.duration(1000)} style={styles.buttonText}>Get Started</Animated.Text>
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
    paddingHorizontal: wp(5),
    paddingBottom: hp(6),
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: wp(8),
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
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: hp(2),
    paddingHorizontal: wp(20),
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: wp(5),
    textAlign: 'center',
    fontWeight: '600',
  },
});
