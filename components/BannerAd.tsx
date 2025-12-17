import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface BannerAdComponentProps {
  unitId?: string;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({ unitId }) => {
  // Use test IDs during development, actual IDs in production
  const adUnitId = __DEV__ 
    ? TestIds.BANNER 
    : unitId || (Platform.OS === 'android' 
      ? 'ca-app-pub-4650558064891712/8281238631' 
      : 'ca-app-pub-4650558064891712/5710915618');

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
});

export default BannerAdComponent;

