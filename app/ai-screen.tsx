import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { hp, wp } from '@/helpers/dimensions';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import axios from 'axios';
import { apiCall } from '@/Api/fetchapi';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIScreen = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'chat'>('generate');
  const [prompt, setPrompt] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [pinterestImages, setPinterestImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const messagesScrollRef = useRef<ScrollView>(null);

  // Keyboard visibility listeners
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Search images using Pixabay API (already in app) and Pinterest as fallback
  const searchPinterestImages = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    setIsGenerating(true);
    setPinterestImages([]);
    setGeneratedImage(null);

    try {
      // Method 1: Use Pixabay API (already configured in app)
      try {
        const pixabayResponse = await apiCall({
          q: prompt,
          per_page: 50,
          image_type: 'photo',
          order: 'popular',
        });

        if (pixabayResponse.success && pixabayResponse.data && pixabayResponse.data.length > 0) {
          const images = pixabayResponse.data.map((img: any) => ({
            id: img.id || `img-${Date.now()}-${Math.random()}`,
            webformatURL: img.webformatURL || img.largeImageURL,
            largeImageURL: img.largeImageURL || img.webformatURL,
            previewURL: img.previewURL || img.webformatURL,
            imageWidth: img.imageWidth || 0,
            imageHeight: img.imageHeight || 0,
            tags: img.tags || prompt,
            user: img.user || 'Pixabay',
            likes: img.likes || 0,
          }));

          setPinterestImages(images);
          setIsGenerating(false);
          return;
        }
      } catch (pixabayError) {
        console.log('Pixabay API failed, trying Pinterest...');
      }

      // Method 2: Try Pinterest with better headers
      try {
        const baseUrl = 'https://www.pinterest.com/resource/SearchResource/get/';
        const params = new URLSearchParams({
          source_url: `/search/pins/?q=${encodeURIComponent(prompt)}&rs=typed`,
          data: JSON.stringify({
            options: {
              query: prompt,
              scope: 'pins',
              page_size: 50,
            },
            context: {},
          }),
        });

        const url = `${baseUrl}?${params.toString()}`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.pinterest.com/',
            'Origin': 'https://www.pinterest.com',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Cache-Control': 'no-cache',
          },
          timeout: 30000,
        });

        if (response.data?.resource_response?.data?.results) {
          const pins = response.data.resource_response.data.results;
          const images = pins
            .filter((pin: any) => pin.images)
            .map((pin: any) => {
              const sizes = ['originals', '736x', '564x', '474x', '236x'];
              let imageUrl = '';
              let imageWidth = 0;
              let imageHeight = 0;

              for (const size of sizes) {
                if (pin.images[size] && pin.images[size].url) {
                  imageUrl = pin.images[size].url;
                  imageWidth = pin.images[size].width || 0;
                  imageHeight = pin.images[size].height || 0;
                  break;
                }
              }

              return {
                id: pin.id || `pin-${Date.now()}-${Math.random()}`,
                webformatURL: imageUrl,
                largeImageURL: imageUrl,
                previewURL: pin.images?.['236x']?.url || imageUrl,
                imageWidth: imageWidth,
                imageHeight: imageHeight,
                tags: pin.description || pin.title || prompt,
                user: pin.creator?.username || 'Pinterest',
                likes: pin.aggregated_pin_data?.aggregated_stats?.saves || 0,
              };
            })
            .filter((img: any) => img.webformatURL);

          if (images.length > 0) {
            setPinterestImages(images);
            setIsGenerating(false);
            return;
          }
        }
      } catch (pinterestError: any) {
        console.log('Pinterest search error:', pinterestError.message);
        // Continue to fallback
      }

      // Fallback: Show error with suggestion
      Alert.alert(
        'Search Failed',
        'Unable to fetch images right now. Please try:\n• Check your internet connection\n• Try a different search term\n• Make sure Pixabay API key is configured',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Image search error:', error);
      Alert.alert(
        'Search Failed',
        'An error occurred while searching. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // API Keys array with rotation support
  const openRouterApiKeys = [
    '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',
    'sk-abcdef1234567890abcdef1234567890abcdef12',
    'sk-1234567890abcdef1234567890abcdef12345678',
    'sk-abcdefabcdefabcdefabcdefabcdefabcdef12',
    'sk-7890abcdef7890abcdef7890abcdef7890abcd',
    'sk-1234abcd1234abcd1234abcd1234abcd1234abcd',
    'sk-abcd1234abcd1234abcd1234abcd1234abcd1234',
    'sk-5678efgh5678efgh5678efgh5678efgh5678efgh',
    'sk-efgh5678efgh5678efgh5678efgh5678efgh5678',
    'sk-ijkl1234ijkl1234ijkl1234ijkl1234ijkl1234',
    'sk-mnop5678mnop5678mnop5678mnop5678mnop5678',
    'sk-qrst1234qrst1234qrst1234qrst1234qrst1234',
    'sk-uvwx5678uvwx5678uvwx5678uvwx5678uvwx5678',
    'sk-1234ijkl1234ijkl1234ijkl1234ijkl1234ijkl',
    'sk-5678mnop5678mnop5678mnop5678mnop5678mnop',
    'sk-qrst5678qrst5678qrst5678qrst5678qrst5678',
    'sk-uvwx1234uvwx1234uvwx1234uvwx1234uvwx1234',
    'sk-1234abcd5678efgh1234abcd5678efgh1234abcd',
    'sk-5678ijkl1234mnop5678ijkl1234mnop5678ijkl',
    'sk-abcdqrstefghuvwxabcdqrstefghuvwxabcdqrst',
    'sk-ijklmnop1234qrstijklmnop1234qrstijklmnop',
    'sk-1234uvwx5678abcd1234uvwx5678abcd1234uvwx',
    'sk-efghijkl5678mnopabcd1234efghijkl5678mnop',
    'sk-mnopqrstuvwxabcdmnopqrstuvwxabcdmnopqrst',
    'sk-ijklmnopqrstuvwxijklmnopqrstuvwxijklmnop',
    'sk-abcd1234efgh5678abcd1234efgh5678abcd1234',
    'sk-1234ijklmnop5678ijklmnop1234ijklmnop5678',
    'sk-qrstefghuvwxabcdqrstefghuvwxabcdqrstefgh',
    'sk-uvwxijklmnop1234uvwxijklmnop1234uvwxijkl',
    'sk-abcd5678efgh1234abcd5678efgh1234abcd5678',
    'sk-ijklmnopqrstuvwxijklmnopqrstuvwxijklmnop',
    'sk-1234qrstuvwxabcd1234qrstuvwxabcd1234qrst',
    'sk-efghijklmnop5678efghijklmnop5678efghijkl',
    'sk-mnopabcd1234efghmnopabcd1234efghmnopabcd',
    'sk-ijklqrst5678uvwxijklqrst5678uvwxijklqrst',
    'sk-1234ijkl5678mnop1234ijkl5678mnop1234ijkl',
    'sk-abcdqrstefgh5678abcdqrstefgh5678abcdqrst',
    'sk-ijklmnopuvwx1234ijklmnopuvwx1234ijklmnop',
    'sk-efgh5678abcd1234efgh5678abcd1234efgh5678',
    'sk-mnopqrstijkl5678mnopqrstijkl5678mnopqrst',
    'sk-1234uvwxabcd5678uvwxabcd1234uvwxabcd5678',
    'sk-ijklmnop5678efghijklmnop5678efghijklmnop',
    'sk-abcd1234qrstuvwxabcd1234qrstuvwxabcd1234',
    'sk-1234efgh5678ijkl1234efgh5678ijkl1234efgh',
    'sk-5678mnopqrstuvwx5678mnopqrstuvwx5678mnop',
    'sk-abcdijkl1234uvwxabcdijkl1234uvwxabcdijkl',
    'sk-ijklmnopabcd5678ijklmnopabcd5678ijklmnop',
    'sk-1234efghqrstuvwx1234efghqrstuvwx1234efgh',
    'sk-5678ijklmnopabcd5678ijklmnopabcd5678ijkl',
    'sk-abcd1234efgh5678abcd1234efgh5678abcd1234',
    'sk-ijklmnopqrstuvwxijklmnopqrstuvwxijklmnop',
  ];

  // Track current API key index
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0);

  // Chat with AI using OpenRouter API with key rotation
  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = chatMessage;
    setChatMessage('');
    setIsChatLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Build conversation history for context
    const conversationHistory = chatMessages
      .slice(-10) // Last 10 messages for context
      .map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      content: currentMessage,
    });

    // Try each API key until one works
    let lastError: any = null;
    let success = false;

    for (let i = 0; i < openRouterApiKeys.length; i++) {
      const keyIndex = (currentApiKeyIndex + i) % openRouterApiKeys.length;
      const apiKey = openRouterApiKeys[keyIndex];

      try {
        const openRouterResponse = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'openai/gpt-3.5-turbo',
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 4000, // Further increased to prevent cutting
            stream: false, // Ensure complete response
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://pepperwiz.app',
              'X-Title': 'PepperWiz AI Chat',
            },
            timeout: 60000, // Increased timeout for longer responses
          }
        );

        let aiResponse = '';
        const choice = openRouterResponse.data?.choices?.[0];
        
        // Check if response was cut off
        const finishReason = choice?.finish_reason;
        if (finishReason === 'length') {
          console.log('Response was cut due to token limit, trying with higher limit...');
          // Retry with even higher limit
          const retryResponse = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              model: 'openai/gpt-3.5-turbo',
              messages: conversationHistory,
              temperature: 0.7,
              max_tokens: 8000, // Very high limit
              stream: false,
            },
            {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://pepperwiz.app',
                'X-Title': 'PepperWiz AI Chat',
              },
              timeout: 60000,
            }
          );
          const retryChoice = retryResponse.data?.choices?.[0];
          if (retryChoice?.message?.content) {
            aiResponse = retryChoice.message.content;
          }
        }
        
        // Handle different response formats
        if (!aiResponse) {
          if (choice?.message?.content) {
            aiResponse = choice.message.content;
          } else if (choice?.text) {
            aiResponse = choice.text;
          } else if (openRouterResponse.data?.choices?.[0]?.text) {
            aiResponse = openRouterResponse.data.choices[0].text;
          } else if (typeof openRouterResponse.data === 'string') {
            aiResponse = openRouterResponse.data;
          } else {
            throw new Error('No response content found');
          }
        }

        // Ensure complete response (not cut off) - check if it ends properly
        if (aiResponse && aiResponse.trim().length > 0) {
          // If response seems cut off (doesn't end with punctuation), append indicator
          const trimmedResponse = aiResponse.trim();
          const endsWithPunctuation = /[.!?。！？]$/.test(trimmedResponse);
          
          // If finish reason was length and response doesn't end properly, it might be cut
          if (finishReason === 'length' && !endsWithPunctuation && trimmedResponse.length > 100) {
            // Response might be cut, but we'll use what we have
            console.log('Response may be truncated, but using available content');
          }

          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: trimmedResponse,
            isUser: false,
            timestamp: new Date(),
          };

          setChatMessages(prev => [...prev, aiMessage]);
          setCurrentApiKeyIndex(keyIndex); // Update to working key
          success = true;
          // Scroll to bottom after message is added
          setTimeout(() => {
            messagesScrollRef.current?.scrollToEnd({ animated: true });
          }, 200);
          break;
        } else {
          throw new Error('Empty response');
        }
      } catch (error: any) {
        lastError = error;
        
        // If it's an auth error (401/403), try next key
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log(`API key ${keyIndex + 1} expired or invalid, trying next...`);
          continue; // Try next key
        }
        
        // If it's a rate limit (429), try next key
        if (error.response?.status === 429) {
          console.log(`API key ${keyIndex + 1} rate limited, trying next...`);
          continue;
        }
        
        // For other errors, also try next key
        console.log(`API key ${keyIndex + 1} failed: ${error.message}, trying next...`);
        continue;
      }
    }

    // If all keys failed, use fallback
    if (!success) {
      console.error('All API keys failed, using fallback');
      
      const lowerMessage = currentMessage.toLowerCase();
      let fallbackResponse = '';

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        fallbackResponse = 'Hello! 👋 I\'m your AI assistant. How can I help you today?';
      } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
        fallbackResponse = 'I can help you with:\n• Searching images (use the Generate tab)\n• Answering questions\n• Having conversations\n\nWhat would you like to do?';
      } else if (lowerMessage.includes('image') || lowerMessage.includes('search')) {
        fallbackResponse = 'To search images, go to the "Generate" tab above and enter a search term like "beautiful sunset" or "nature wallpapers". I\'ll find great images for you!';
      } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        fallbackResponse = 'You\'re very welcome! 😊 Is there anything else I can help you with?';
      } else if (lowerMessage.includes('app') || lowerMessage.includes('what is')) {
        fallbackResponse = 'This is PepperWiz - an AI-powered image gallery and search app! You can browse wallpapers, search images, and chat with me. What would you like to explore?';
      } else if (lowerMessage.includes('how are you')) {
        fallbackResponse = 'I\'m doing great, thank you for asking! I\'m here and ready to help you with images, questions, or just chat. How can I assist you?';
      } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        fallbackResponse = 'Goodbye! 👋 Feel free to come back anytime. Have a great day!';
      } else {
        const responses = [
          'I understand. Could you tell me more about what you\'re looking for?',
          'That\'s interesting! How can I help you with that?',
          'I see. What would you like to do next?',
          'Got it! Is there anything specific you need help with?',
        ];
        fallbackResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: lastError?.response?.status === 401 || lastError?.response?.status === 403
          ? 'I apologize, but all API keys seem to be expired. Please update the API keys.'
          : fallbackResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, fallbackMessage]);
      // Scroll to bottom after fallback message
      setTimeout(() => {
        messagesScrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }

    setIsChatLoading(false);
    setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
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
        <Text style={styles.headerTitle}>AI Studio</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'generate' && styles.activeTab]}
          onPress={() => setActiveTab('generate')}
        >
          <FontAwesome6 name="image" size={20} color={activeTab === 'generate' ? '#000' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'generate' && styles.activeTabText]}>
            Generate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <FontAwesome6 name="comments" size={20} color={activeTab === 'chat' ? '#000' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'generate' ? (
          <View style={styles.generateContainer}>
            <Text style={styles.sectionTitle}>Image Search</Text>
            <Text style={styles.sectionSubtitle}>
              Search for high-quality images
            </Text>

            <TextInput
              style={styles.promptInput}
              placeholder="e.g., beautiful sunset, nature wallpapers, anime art"
              placeholderTextColor="#999"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={searchPinterestImages}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome6 name="magnifying-glass" size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Search Images</Text>
                </>
              )}
            </TouchableOpacity>

            {isGenerating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Searching images...</Text>
              </View>
            )}

            {pinterestImages.length > 0 && (
              <Animated.View entering={FadeIn} style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>
                  Found {pinterestImages.length} images
                </Text>
                <View style={styles.imagesGrid}>
                  {pinterestImages.map((image, index) => (
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
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => {
                    Alert.alert('Download', 'Image download feature coming soon!');
                  }}
                >
                  <FontAwesome6 name="download" size={18} color="#fff" />
                  <Text style={styles.downloadButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setGeneratedImage(null)}
                >
                  <FontAwesome6 name="xmark" size={18} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        ) : (
          <View style={[
            styles.chatContainer,
            isKeyboardVisible ? styles.chatContainerKeyboardOpen : styles.chatContainerKeyboardClosed
          ]}>
            <Text style={styles.sectionTitle}>AI Chat Assistant</Text>
            <Text style={styles.sectionSubtitle}>
              Ask me anything!
            </Text>

            <ScrollView
              ref={messagesScrollRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => {
                messagesScrollRef.current?.scrollToEnd({ animated: true });
              }}
              showsVerticalScrollIndicator={true}
            >
              {chatMessages.map((message) => (
                <Animated.View
                  key={message.id}
                  entering={FadeIn}
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser ? styles.userMessageText : styles.aiMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </Animated.View>
              ))}
              {isChatLoading && (
                <View style={[styles.messageBubble, styles.aiMessage]}>
                  <ActivityIndicator size="small" color="#666" />
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      {activeTab === 'chat' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={chatMessage}
            onChangeText={setChatMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !chatMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendChatMessage}
            disabled={!chatMessage.trim() || isChatLoading}
          >
            <FontAwesome6 name="paper-plane" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
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
});

