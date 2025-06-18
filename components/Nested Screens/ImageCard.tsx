import { getimageheight } from '@/helpers/dimensions';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface ImageCardProps {
  item: {
    webformatURL?: string;
    previewURL?: string;
    largeImageURL?: string;
    imageHeight?: number;
    imageWidth?: number;
  };
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const imageUrl = item.webformatURL || item.previewURL || item.largeImageURL;

  const getDynamicHeight = () => {
    let { imageHeight = 350, imageWidth = 185 } = item;
    if (imageHeight < 100 || imageWidth < 100) return { height: 80 };
    return { height: getimageheight(imageHeight, imageWidth) };
  };

  const handleDownload = async () => {
    if (Platform.OS === 'web') {
      // Open image in new tab on web
      if (imageUrl) {
        Linking.openURL(imageUrl);
      } else {
        Alert.alert('Error', 'Image URL not found.');
      }
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow storage access to download images.');
        return;
      }

      const fileUri = FileSystem.documentDirectory + `${Date.now()}.jpg`;
      const download = await FileSystem.downloadAsync(imageUrl || '', fileUri);

      const asset = await MediaLibrary.createAssetAsync(download.uri);
      await MediaLibrary.createAlbumAsync('PepperWiz', asset, false);

      Alert.alert('Success', 'Image downloaded to gallery.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to download image.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: imageUrl || '', url: imageUrl });
    } catch (error) {
      Alert.alert('Error', 'Unable to share image.');
    }
  };

  const imageWidth = Platform.OS === 'web' ? width / 3 - 16 : 185;

  return (
    <>
      <Animated.View entering={SlideInUp.delay(200).damping(2)}>
        <StatusBar hidden={true} />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, getDynamicHeight(), { width: imageWidth }]}
            contentFit="cover"
            transition={100}
          />
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.fullscreenImage}
              contentFit="contain"
              transition={200}
            />
            <View style={styles.iconBar}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setModalVisible(false)}>
                <Icon name="times" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleDownload}>
                <Icon name="download" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                <Icon name="share-alt" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    margin: 6,
    borderRadius: 14,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  iconBar: {
    position: 'absolute',
    bottom: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  iconBtn: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
