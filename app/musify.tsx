import { hp, wp } from '@/helpers/dimensions';
import useInterstitialAd from '@/hooks/useInterstitialAd';
import { FontAwesome6 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// Using a custom slider implementation with buttons

interface SoundItem {
  id: string;
  name: string;
  file: any;
  sound: Audio.Sound | null;
  isPlaying: boolean;
  volume: number;
}

const soundFiles = [
  { id: '2', name: 'Little Birds in Trees', file: require('@/assets/Musify/mixkit-little-birds-singing-in-the-trees-17.wav') },
  { id: '3', name: 'Evil Storm Atmosphere', file: require('@/assets/Musify/mixkit-evil-storm-atmosphere-2404.wav') },
  { id: '4', name: 'Thunderstorm and Rain Loop', file: require('@/assets/Musify/mixkit-thunderstorm-and-rain-loop-2402.wav') },
  { id: '5', name: 'Rain Long Loop', file: require('@/assets/Musify/mixkit-rain-long-loop-2394.wav') },
  { id: '6', name: 'Thunder Rumble', file: require('@/assets/Musify/mixkit-thunder-rumble-during-a-storm-2395.wav') },
  { id: '7', name: 'Heavy Rain Drops', file: require('@/assets/Musify/mixkit-heavy-rain-drops-2399.wav') },
  { id: '8', name: 'Water Flowing Ambience', file: require('@/assets/Musify/mixkit-water-flowing-ambience-loop-3126.wav') },
  { id: '9', name: 'Birds in the Jungle', file: require('@/assets/Musify/mixkit-birds-in-the-jungle-2434.wav') },
  { id: '10', name: 'Birds Chirping Near River', file: require('@/assets/Musify/mixkit-birds-chirping-near-the-river-2473.wav') },
  { id: '11', name: 'Calm Thunderstorm in Jungle', file: require('@/assets/Musify/mixkit-calm-thunderstorm-in-the-jungle-2415.wav') },
  { id: '12', name: 'Morning Birds', file: require('@/assets/Musify/mixkit-morning-birds-2472.wav') },
  { id: '13', name: 'Wolves at Scary Forest', file: require('@/assets/Musify/mixkit-wolves-at-scary-forest-2485.wav') },
  { id: '14', name: 'Wind Blowing Ambience', file: require('@/assets/Musify/mixkit-wind-blowing-ambience-2658.wav') },
  { id: '15', name: 'Rain and Thunder Storm', file: require('@/assets/Musify/mixkit-rain-and-thunder-storm-2390.wav') },
  { id: '16', name: 'Light Rain Loop', file: require('@/assets/Musify/mixkit-light-rain-loop-2393.wav') },
];

const MusifyScreen = () => {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [masterVolume, setMasterVolume] = useState(1);
  const [isMasterPlaying, setIsMasterPlaying] = useState(false);
  const [masterVolumeBarWidth, setMasterVolumeBarWidth] = useState(200);
  const { showAd } = useInterstitialAd();

  // Show interstitial ad when screen opens
  useEffect(() => {
    const timer = setTimeout(() => {
      showAd();
    }, 1000); // Show ad after 1 second delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialize sounds
    const initializeSounds = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const initializedSounds = soundFiles.map(sound => ({
        id: sound.id,
        name: sound.name,
        file: sound.file,
        sound: null,
        isPlaying: false,
        volume: 0.5,
      }));

      setSounds(initializedSounds);
    };

    initializeSounds();

    // Cleanup on unmount
    return () => {
      sounds.forEach(async (soundItem) => {
        if (soundItem.sound) {
          await soundItem.sound.unloadAsync();
        }
      });
    };
  }, []);

  const loadSound = async (soundItem: SoundItem): Promise<Audio.Sound> => {
    if (soundItem.sound) {
      return soundItem.sound;
    }

    const { sound } = await Audio.Sound.createAsync(
      soundItem.file,
      {
        isLooping: true,
        volume: soundItem.volume * masterVolume,
        shouldPlay: false,
      }
    );

    return sound;
  };

  const toggleSound = async (id: string) => {
    const updatedSounds = sounds.map(async (soundItem) => {
      if (soundItem.id === id) {
        const sound = await loadSound(soundItem);
        
        if (soundItem.isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.setVolumeAsync(soundItem.volume * masterVolume);
          await sound.playAsync();
        }

        return {
          ...soundItem,
          sound,
          isPlaying: !soundItem.isPlaying,
        };
      }
      return soundItem;
    });

    const resolvedSounds = await Promise.all(updatedSounds);
    setSounds(resolvedSounds);
    updateMasterPlayingState(resolvedSounds);
  };

  const updateSoundVolume = async (id: string, volume: number) => {
    const updatedSounds = sounds.map(async (soundItem) => {
      if (soundItem.id === id) {
        const newVolume = volume;
        const sound = soundItem.sound || await loadSound(soundItem);
        
        if (sound) {
          await sound.setVolumeAsync(newVolume * masterVolume);
        }

        return {
          ...soundItem,
          sound,
          volume: newVolume,
        };
      }
      return soundItem;
    });

    const resolvedSounds = await Promise.all(updatedSounds);
    setSounds(resolvedSounds);
  };

  const updateMasterVolume = async (volume: number) => {
    setMasterVolume(volume);
    
    const updatedSounds = sounds.map(async (soundItem) => {
      if (soundItem.sound) {
        await soundItem.sound.setVolumeAsync(soundItem.volume * volume);
      }
      return soundItem;
    });

    await Promise.all(updatedSounds);
  };

  const toggleMasterPlayPause = async () => {
    if (isMasterPlaying) {
      // Pause all sounds
      const updatedSounds = sounds.map(async (soundItem) => {
        if (soundItem.sound && soundItem.isPlaying) {
          await soundItem.sound.pauseAsync();
        }
        return {
          ...soundItem,
          isPlaying: false,
        };
      });

      const resolvedSounds = await Promise.all(updatedSounds);
      setSounds(resolvedSounds);
      setIsMasterPlaying(false);
    } else {
      // Play all sounds that were previously playing
      const updatedSounds = sounds.map(async (soundItem) => {
        if (soundItem.volume > 0) {
          const sound = await loadSound(soundItem);
          await sound.setVolumeAsync(soundItem.volume * masterVolume);
          await sound.playAsync();
          return {
            ...soundItem,
            sound,
            isPlaying: true,
          };
        }
        return soundItem;
      });

      const resolvedSounds = await Promise.all(updatedSounds);
      setSounds(resolvedSounds);
      setIsMasterPlaying(true);
    }
  };

  const updateMasterPlayingState = (currentSounds: SoundItem[]) => {
    const anyPlaying = currentSounds.some(s => s.isPlaying);
    setIsMasterPlaying(anyPlaying);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Background Image */}
      <Image
        source={require('@/assets/onboarding/welcome.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        colors={[
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(255,255,255,0.8)',
          'white',
        ]}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Musify</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Controls */}
        <View style={styles.masterControls}>
          <View style={styles.masterHeader}>
            <FontAwesome6 name="sliders" size={20} color="#000" />
            <Text style={styles.masterTitle}>Master Controls</Text>
          </View>
          
          <View style={styles.masterPlayPauseContainer}>
            <TouchableOpacity
              style={[
                styles.masterPlayPauseButton,
                isMasterPlaying && styles.masterPlayPauseButtonActive
              ]}
              onPress={toggleMasterPlayPause}
              activeOpacity={0.8}
            >
              <View style={styles.masterPlayPauseInner}>
                <FontAwesome6
                  name={isMasterPlaying ? 'pause' : 'play'}
                  size={28}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.masterVolumeWrapper}>
            <View style={styles.masterVolumeContainer}>
              <TouchableOpacity
                onPress={() => updateMasterVolume(Math.max(0, masterVolume - 0.1))}
                style={styles.volumeButton}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="volume-low" size={18} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.volumeBarContainer}
                onLayout={(e) => {
                  setMasterVolumeBarWidth(e.nativeEvent.layout.width);
                }}
                onPress={(e) => {
                  const { locationX } = e.nativeEvent;
                  const newVolume = Math.max(0, Math.min(1, locationX / masterVolumeBarWidth));
                  updateMasterVolume(newVolume);
                }}
                activeOpacity={1}
              >
                <View style={styles.volumeBarTrack}>
                  <View style={[styles.volumeBar, { width: `${masterVolume * 100}%` }]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateMasterVolume(Math.min(1, masterVolume + 0.1))}
                style={styles.volumeButton}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="volume-high" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.volumeLabel}>{Math.round(masterVolume * 100)}%</Text>
          </View>
        </View>

        {/* Sounds Grid */}
        <View style={styles.soundsContainer}>
          <View style={styles.soundsTitleContainer}>
            <FontAwesome6 name="music" size={20} color="#000" />
            <Text style={styles.soundsTitle}>Nature Sounds</Text>
          </View>
          <View style={styles.soundsGrid}>
            {sounds.map((soundItem) => (
              <View 
                key={soundItem.id} 
                style={[
                  styles.soundCard,
                  soundItem.isPlaying && styles.soundCardActive
                ]}
              >
                <View style={styles.soundCardContent}>
                  <View style={styles.soundHeader}>
                    <Text style={styles.soundName} numberOfLines={2}>{soundItem.name}</Text>
                    <TouchableOpacity
                      style={[
                        styles.playPauseButton,
                        soundItem.isPlaying && styles.playPauseButtonActive
                      ]}
                      onPress={() => toggleSound(soundItem.id)}
                      activeOpacity={0.8}
                    >
                      <FontAwesome6
                        name={soundItem.isPlaying ? 'pause' : 'play'}
                        size={14}
                        color={soundItem.isPlaying ? "#fff" : "#000"}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.volumeContainer}>
                    <TouchableOpacity
                      onPress={() => updateSoundVolume(soundItem.id, Math.max(0, soundItem.volume - 0.1))}
                      style={styles.volumeButtonSmall}
                      activeOpacity={0.7}
                    >
                      <FontAwesome6 name="volume-low" size={11} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.volumeBarContainerSmall}
                      onPress={(e) => {
                        const { locationX } = e.nativeEvent;
                        const estimatedWidth = wp(35);
                        const newVolume = Math.max(0, Math.min(1, locationX / estimatedWidth));
                        updateSoundVolume(soundItem.id, newVolume);
                      }}
                      activeOpacity={1}
                    >
                      <View style={styles.volumeBarTrackSmall}>
                        <View style={[styles.volumeBarSmall, { width: `${soundItem.volume * 100}%` }]} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateSoundVolume(soundItem.id, Math.min(1, soundItem.volume + 0.1))}
                      style={styles.volumeButtonSmall}
                      activeOpacity={0.7}
                    >
                      <FontAwesome6 name="volume-high" size={11} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.volumeInfoRow}>
                    <View style={styles.volumeIndicator}>
                      <View style={[styles.volumeDot, { opacity: soundItem.volume > 0 ? 1 : 0.3 }]} />
                    </View>
                    <Text style={styles.volumePercentage}>
                      {Math.round(soundItem.volume * 100)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MusifyScreen;

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
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(4),
    paddingBottom: hp(2),
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  masterControls: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: wp(5),
    marginBottom: hp(3),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  masterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(2),
  },
  masterTitle: {
    fontSize: hp(2),
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.3,
  },
  masterPlayPauseContainer: {
    alignItems: 'center',
    marginVertical: hp(2),
  },
  masterPlayPauseButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  masterPlayPauseButtonActive: {
    backgroundColor: '#1a1a1a',
    transform: [{ scale: 0.95 }],
  },
  masterPlayPauseInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  masterVolumeWrapper: {
    marginTop: hp(1),
  },
  masterVolumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
    marginBottom: hp(0.5),
  },
  volumeButton: {
    padding: wp(2.5),
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  volumeBarContainer: {
    flex: 1,
    height: 10,
  },
  volumeBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
    overflow: 'hidden',
  },
  volumeBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 5,
  },
  volumeLabel: {
    fontSize: hp(1.5),
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: hp(0.5),
  },
  soundsContainer: {
    gap: hp(2),
  },
  soundsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(2),
  },
  soundsTitle: {
    fontSize: hp(2.2),
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.5,
  },
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: wp(2.5),
  },
  soundCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: wp(3.5),
    minHeight: hp(16),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  soundCardActive: {
    borderColor: '#000',
    borderWidth: 2,
    backgroundColor: 'rgba(250, 250, 250, 0.95)',
  },
  soundCardContent: {
    flex: 1,
    gap: hp(1),
  },
  soundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
    gap: wp(2),
  },
  soundName: {
    fontSize: hp(1.7),
    fontWeight: '700',
    color: '#000',
    flex: 1,
    lineHeight: hp(2.2),
    letterSpacing: -0.2,
  },
  playPauseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  playPauseButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginTop: hp(0.5),
    marginBottom: hp(0.5),
  },
  volumeButtonSmall: {
    padding: wp(1.5),
    borderRadius: 6,
  },
  volumeBarContainerSmall: {
    flex: 1,
    height: 5,
  },
  volumeBarTrackSmall: {
    flex: 1,
    height: 5,
    backgroundColor: '#e8e8e8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  volumeBarSmall: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 3,
  },
  volumeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  volumeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  volumePercentage: {
    fontSize: hp(1.3),
    color: '#666',
    fontWeight: '600',
  },
});

