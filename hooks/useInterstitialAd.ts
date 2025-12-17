import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const useInterstitialAd = (unitId?: string) => {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use test IDs during development, actual IDs in production
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : unitId || (Platform.OS === 'android'
      ? 'ca-app-pub-4650558064891712/3001169403'
      : 'ca-app-pub-4650558064891712/7655370915');

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribe = ad.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    ad.load();

    setInterstitialAd(ad);

    return () => {
      unsubscribe();
    };
  }, [adUnitId]);

  const showAd = () => {
    if (interstitialAd && isLoaded) {
      interstitialAd.show();
      setIsLoaded(false);
      // Reload ad after showing
      interstitialAd.load();
    }
  };

  return { showAd, isLoaded };
};

export default useInterstitialAd;

