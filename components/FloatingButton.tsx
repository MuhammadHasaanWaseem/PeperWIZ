import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { hp, wp } from '@/helpers/dimensions';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface FloatingButtonProps {
  onPress: () => void;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  imageUri?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon = 'sparkles',
  iconSize = 28,
  iconColor = '#000',
  imageUri,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <FontAwesome6 name={icon as any} size={iconSize} color={iconColor} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: hp(3),
    alignSelf: 'center',
    zIndex: 1000,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // borderWidth: 1,
    // borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
});

export default FloatingButton;

