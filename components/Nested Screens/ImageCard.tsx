import { getimageheight } from '@/helpers/dimensions';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import { Alert, Modal, Platform, Pressable, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInRight, SlideInUp } from 'react-native-reanimated';
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
  const imageUrl = item.webformatURL || item.previewURL || item.largeImageURL;

  const getDynamicHeight = () => {
    let { imageHeight = 350, imageWidth = 185 } = item;
    if (imageHeight < 100 || imageWidth < 100) return { height: 80 };
    return { height: getimageheight(imageHeight, imageWidth) };
  };

  const handleDownload = async () => {
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

  return (
    <>
      <Animated.View entering={SlideInUp.delay(200).damping(2)}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            style={[styles.image, getDynamicHeight()]}
            transition={100}
            source={{ uri: imageUrl }}
            contentFit="cover"
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
            <Animated.View entering={SlideInRight.duration(300).damping(2)} style={styles.iconBar}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="times" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDownload}>
                <Icon name="download" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare}>
                <Icon name="share-alt" size={22} color="white" />
              </TouchableOpacity>
            </Animated.View>
            
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    width: Platform.OS === 'web' ? '100%' : 185,
    margin: 3,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
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
    bottom: '25%',
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap: 50,
    borderRadius:30,
    padding: 10,
    
  },
});
