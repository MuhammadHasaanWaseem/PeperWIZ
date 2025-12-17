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
  position?: 'left' | 'center' | 'right';
}

const getContainerStyle = (position: 'left' | 'center' | 'right') => {
  const baseStyle = {
    zIndex: 1000,
  };

  switch (position) {
    case 'left':
      return { ...baseStyle, position: 'absolute' as const, bottom: hp(3), left: wp(6) };
    case 'right':
      return { ...baseStyle, position: 'absolute' as const, bottom: hp(3), right: wp(6) };
    case 'center':
    default:
      return baseStyle;
  }
};

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon = 'sparkles',
  iconSize = 28,
  iconColor = '#000',
  imageUri,
  position = 'center',
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
    <Animated.View style={[getContainerStyle(position), animatedStyle]}>
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
});

export default FloatingButton;
