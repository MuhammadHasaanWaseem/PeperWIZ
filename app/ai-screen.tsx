import FloatingButton from '@/components/FloatingButton';
import { hp, wp } from '@/helpers/dimensions';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Image as ExpoImage } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const AIScreen = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportImageUrl, setReportImageUrl] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [pexelsImages, setPexelsImages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load curated images on mount
  useEffect(() => {
    fetchPexelsImages('nature');
  }, []);

  // Fetch images from Pexels API
  const fetchPexelsImages = async (query: string = 'nature') => {
    setIsGenerating(true);
    setPexelsImages([]);
    setGeneratedImage(null);

    try {
      const PEXELS_API_KEY = 'NQHsjZnCgp0xCFGWCMjtz3K7zom40Usm765TQ1GUOKYbMS3yDfMyvwSQ';
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=80&page=1`,
        {
          headers: {
            'Authorization': PEXELS_API_KEY,
          },
        }
      );

      if (response.data?.photos && response.data.photos.length > 0) {
        const images = response.data.photos.map((photo: any) => ({
          id: photo.id,
          webformatURL: photo.src.large,
          previewURL: photo.src.medium,
          largeImageURL: photo.src.original || photo.src.large2x,
          imageWidth: photo.width,
          imageHeight: photo.height,
          tags: photo.alt || query,
          user: photo.photographer,
          photographer_url: photo.photographer_url,
          photo_url: photo.url,
          avg_color: photo.avg_color,
          likes: 0,
        }));

        setPexelsImages(images);
      }
    } catch (error: any) {
      console.error('Pexels API error:', error);
      setErrorMessage('Failed to fetch images from Pexels. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleActionSheetOption = (option: string) => {
    setShowActionSheet(false);
    fetchPexelsImages(option);
  };

  const handleDownloadImage = async (imageUrl: string, imageId?: string) => {
    if (Platform.OS === 'web') {
      // Open image in new tab on web
      Linking.openURL(imageUrl);
      return;
    }

    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission Denied. Please allow storage access to download images.');
        setShowErrorModal(true);
        return;
      }

      if (imageId) {
        setDownloadingImageId(imageId);
      } else {
        setIsGenerating(true);
      }
      
      // Download image
      const fileUri = FileSystem.documentDirectory + `pexels_${Date.now()}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('PepperWiz', asset, false);

      setErrorMessage('Image saved to gallery successfully!');
      setShowErrorModal(true);
    } catch (error: any) {
      console.error('Download error:', error);
      setErrorMessage('Failed to download image. Please try again.');
      setShowErrorModal(true);
    } finally {
      if (imageId) {
        setDownloadingImageId(null);
      } else {
        setIsGenerating(false);
      }
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchPexelsImages(searchQuery.trim());
    }
  };

  const handleReportImage = (imageUrl: string) => {
    setReportImageUrl(imageUrl);
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      setErrorMessage('Please provide a reason for reporting');
      setShowErrorModal(true);
      return;
    }
    
    // Here you would typically send the report to your backend
    console.log('Report submitted:', { imageUrl: reportImageUrl, reason: reportReason });
    setShowReportModal(false);
    setReportReason('');
    setReportImageUrl(null);
    setErrorMessage('Thank you for your report. We will review it shortly.');
    setShowErrorModal(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pixels</Text>
        <View style={{ width: 40 }} />
      </View>


      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.generateContainer}>
          <Text style={styles.sectionTitle}>Pexels Images</Text>
          <Text style={styles.sectionSubtitle}>
            High-quality free stock photos
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search images..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={!searchQuery.trim() || isGenerating}
            >
              <FontAwesome6 name="magnifying-glass" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

            {isGenerating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Loading images...</Text>
              </View>
            )}

            {pexelsImages.length > 0 && (
              <Animated.View entering={FadeIn} style={styles.resultsContainer}>
                <View style={styles.pexelsAttribution}>
                  <Text style={styles.pexelsAttributionText}>
                    Photos provided by{' '}
                    <Text 
                      style={styles.pexelsLink}
                      onPress={() => Linking.openURL('https://www.pexels.com')}
                    >
                      Pexels
                    </Text>
                  </Text>
                </View>
                <Text style={styles.resultsTitle}>
                  Found {pexelsImages.length} images
                </Text>
                <View style={styles.imagesGrid}>
                  {pexelsImages.map((image, index) => (
                    <TouchableOpacity
                      key={image.id || index}
                      style={styles.imageCard}
                      onPress={() => {
                        setGeneratedImage(image.largeImageURL || image.webformatURL);
                      }}
                    >
                      <ExpoImage
                        source={{ uri: image.previewURL || image.webformatURL }}
                        style={styles.gridImage}
                        contentFit="cover"
                      />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.photographerText} numberOfLines={1}>
                          Photo by {image.user}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.downloadIconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(image.largeImageURL || image.webformatURL, image.id?.toString());
                        }}
                        disabled={downloadingImageId === image.id?.toString()}
                      >
                        {downloadingImageId === image.id?.toString() ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <FontAwesome6 name="download" size={14} color="#fff" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.reportIconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleReportImage(image.largeImageURL || image.webformatURL);
                        }}
                      >
                        <FontAwesome6 name="flag" size={14} color="#fff" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}

            {generatedImage && (
              <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.imageContainer}>
                <ExpoImage
                  source={{ uri: generatedImage }}
                  style={styles.generatedImage}
                  contentFit="contain"
                />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => handleDownloadImage(generatedImage)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <FontAwesome6 name="download" size={18} color="#fff" />
                        <Text style={styles.downloadButtonText}>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reportButton}
                    onPress={() => handleReportImage(generatedImage)}
                  >
                    <FontAwesome6 name="flag" size={18} color="#fff" />
                    <Text style={styles.reportButtonText}>Report</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setGeneratedImage(null)}
                  >
                    <FontAwesome6 name="xmark" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
                {/* Pexels Attribution */}
                <View style={styles.pexelsImageAttribution}>
                  <Text style={styles.pexelsImageAttributionText}>
                    Photo provided by{' '}
                    <Text 
                      style={styles.pexelsImageLink}
                      onPress={() => Linking.openURL('https://www.pexels.com')}
                    >
                      Pexels
                    </Text>
                  </Text>
                </View>
              </Animated.View>
            )}

            {!isGenerating && pexelsImages.length === 0 && (
              <View style={styles.emptyContainer}>
                <FontAwesome6 name="image" size={48} color="#ccc" />
                <Text style={styles.emptyText}>Tap the floating button to browse images</Text>
              </View>
            )}
          </View>
      </ScrollView>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notice</Text>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Floating Button */}
      <FloatingButton
        onPress={() => setShowActionSheet(true)}
        icon="plus"
        iconSize={28}
        iconColor="#000"
      />

      {/* Action Sheet Modal */}
      <Modal
        visible={showActionSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <TouchableOpacity
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowActionSheet(false)}
        >
          <View style={styles.actionSheetContent}>
            <View style={styles.actionSheetHeader}>
              <Text style={styles.actionSheetTitle}>Browse Images</Text>
              <TouchableOpacity onPress={() => setShowActionSheet(false)}>
                <FontAwesome6 name="xmark" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.actionSheetOptions}>
              {['Nature', 'Animals', 'People', 'Architecture', 'Travel', 'Food', 'Technology', 'Art', 'Sports', 'Business', 'Fashion', 'Music'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.actionSheetOption}
                  onPress={() => handleActionSheetOption(option.toLowerCase())}
                >
                  <Text style={styles.actionSheetOptionText}>{option}</Text>
                  <FontAwesome6 name="chevron-right" size={16} color="#666" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Report Image Modal */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportModalContent}>
            <View style={styles.reportModalHeader}>
              <Text style={styles.reportModalTitle}>Report Image</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportImageUrl(null);
                }}
              >
                <FontAwesome6 name="xmark" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.reportModalSubtitle}>
              Please provide a reason for reporting this image
            </Text>
            <TextInput
              style={styles.reportInput}
              placeholder="Enter reason..."
              placeholderTextColor="#999"
              value={reportReason}
              onChangeText={setReportReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.reportModalFooter}>
              <TouchableOpacity
                style={styles.reportCancelButton}
                onPress={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportImageUrl(null);
                }}
              >
                <Text style={styles.reportCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reportSubmitButton}
                onPress={submitReport}
              >
                <Text style={styles.reportSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(4),
    paddingBottom: hp(2),
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingBottom: hp(1),
    gap: wp(2),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    paddingVertical: hp(1.5),
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  generateContainer: {
    gap: hp(2),
  },
  chatContainer: {
    gap: hp(2),
  },
  chatContainerKeyboardOpen: {
    flex: 1,
  },
  chatContainerKeyboardClosed: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: hp(2.8),
    fontWeight: '900',
    color: '#000',
    marginBottom: hp(0.5),
  },
  sectionSubtitle: {
    fontSize: hp(1.8),
    color: '#666',
    marginBottom: hp(2),
  },
  promptInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    padding: wp(4),
    fontSize: hp(2),
    color: '#000',
    minHeight: hp(12),
    marginBottom: hp(2),
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    backgroundColor: '#000',
    paddingVertical: hp(2),
    borderRadius: 18,
    marginBottom: hp(2),
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
  imageContainer: {
    marginTop: hp(2),
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  generatedImage: {
    width: '100%',
    height: hp(40),
    borderRadius: 18,
  },
  downloadButton: {
    position: 'absolute',
    bottom: hp(2),
    right: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 12,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: hp(1.6),
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: hp(4),
    gap: hp(2),
  },
  loadingText: {
    fontSize: hp(1.8),
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
    maxHeight: hp(50),
  },
  messagesContent: {
    gap: hp(1.5),
    paddingBottom: hp(4),
    paddingTop: hp(1),
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: wp(3),
    borderRadius: 18,
    marginBottom: hp(1),
  },
  userMessage: {
    backgroundColor: '#000',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: hp(1.8),
    lineHeight: hp(2.5),
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: wp(2),
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: hp(1.8),
    color: '#000',
    maxHeight: hp(12),
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  resultsContainer: {
    marginTop: hp(2),
    gap: hp(1.5),
  },
  resultsTitle: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp(1),
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    justifyContent: 'space-between',
  },
  imageCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: hp(2),
    right: wp(4),
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    marginTop: hp(2),
    width: '100%',
    height: hp(40),
    borderRadius: 18,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  imageActions: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(4),
    right: wp(4),
    flexDirection: 'row',
    gap: wp(2),
    justifyContent: 'center',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    backgroundColor: 'rgba(255,0,0,0.7)',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 12,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: hp(1.6),
    fontWeight: '700',
  },
  downloadIconButton: {
    position: 'absolute',
    top: wp(2),
    left: wp(2),
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  reportIconButton: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: hp(1.8),
    color: '#000',
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: wp(6),
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    marginBottom: hp(2),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalText: {
    fontSize: hp(1.8),
    color: '#666',
    lineHeight: hp(2.5),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: hp(1.5),
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
  reportModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: wp(4),
    width: '100%',
    maxHeight: hp(60),
  },
  reportModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  reportModalTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  reportModalSubtitle: {
    fontSize: hp(1.8),
    color: '#666',
    marginBottom: hp(2),
  },
  reportInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: wp(4),
    fontSize: hp(1.8),
    color: '#000',
    minHeight: hp(12),
    marginBottom: hp(3),
  },
  reportModalFooter: {
    flexDirection: 'row',
    gap: wp(2),
  },
  reportCancelButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  reportCancelText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#000',
  },
  reportSubmitButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  reportSubmitText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
    gap: hp(2),
  },
  emptyText: {
    fontSize: hp(1.8),
    color: '#999',
    textAlign: 'center',
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: hp(70),
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2),
  },
  actionSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionSheetTitle: {
    fontSize: hp(2.5),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  actionSheetOptions: {
    maxHeight: hp(60),
  },
  actionSheetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionSheetOptionText: {
    fontSize: hp(2),
    fontWeight: '600',
    color: '#000',
  },
  pexelsAttribution: {
    padding: wp(4),
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: hp(2),
    alignItems: 'center',
  },
  pexelsAttributionText: {
    fontSize: hp(1.6),
    color: '#666',
    textAlign: 'center',
  },
  pexelsLink: {
    color: '#000',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
  },
  photographerText: {
    fontSize: hp(1.2),
    color: '#fff',
    fontWeight: '600',
  },
  pexelsImageAttribution: {
    position: 'absolute',
    top: hp(2),
    left: wp(4),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 8,
  },
  pexelsImageAttributionText: {
    fontSize: hp(1.4),
    color: '#666',
  },
  pexelsImageLink: {
    color: '#000',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

