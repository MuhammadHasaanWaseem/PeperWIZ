import { apiCall } from '@/Api/fetchapi';
import BannerAd from '@/components/BannerAd';
import FloatingButton from '@/components/FloatingButton';
import Catagories from '@/components/Nested Screens/catagories';
import Imagegrid from '@/components/Nested Screens/Imagegrid';
import { hp, wp } from '@/helpers/dimensions';
import { FontAwesome6 } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { BounceInLeft, FadeOut } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = React.useState('');
  const searcinputRef = React.useRef<TextInput>(null);
  const [activeCategory, setActiveCategory] = React.useState('backgrounds');
  const [images, setImages] = React.useState<any[]>([]);
  const [menuVisible, setMenuVisible] = React.useState(false);

  // Filter states
  const [selectedImageType, setSelectedImageType] = React.useState('all');
  const [selectedCategory, setSelectedCategory] = React.useState('backgrounds');
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState('popular');

  const [totalResults, setTotalResults] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [hasMoreImages, setHasMoreImages] = React.useState(true);

  const handleactiveCategory = (category: string) => {
    setActiveCategory(category);
    setSelectedCategory(category);
    fetchimages({ category, q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchimages({ category: selectedCategory, q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder }, false);
    };
    fetchData();
  }, []);

  // Listen for filter updates when returning from filters page
  useFocusEffect(
    useCallback(() => {
      if (params.applied === 'true') {
        // Update filter states from params
        if (params.imageType) setSelectedImageType(params.imageType as string);
        if (params.category) setSelectedCategory(params.category as string);
        if (params.colors) {
          const colorsArray = (params.colors as string).split(',').filter(c => c);
          setSelectedColors(colorsArray);
        }
        if (params.order) setSelectedOrder(params.order as string);
        
        // Apply filters
        fetchimages({
          category: (params.category as string) || selectedCategory,
          q: searchText,
          image_type: (params.imageType as string) || selectedImageType,
          colors: params.colors ? (params.colors as string) : selectedColors.join(','),
          order: (params.order as string) || selectedOrder,
          page: 1
        }, false);
        
        // Clear the applied flag
        router.setParams({ applied: undefined });
      }
    }, [params.applied, params.imageType, params.category, params.colors, params.order])
  );

  const fetchimages = async (params: Record<string, any> = { page: 1 }, append = true) => {
    const page = params.page || 1;
    
    if (append) {
      setIsLoadingMore(true);
    }

    let response = await apiCall({ ...params, page, useMultipleSources: true });

    if (response.success && Array.isArray(response.data)) {
      if (append) {
        setImages(prevImages => [...prevImages, ...response.data]);
      } else {
        setImages([...response.data]);
        setCurrentPage(1);
      }
      
      // Set total results if available
      if (response.totalHits && typeof response.totalHits === 'number') {
        setTotalResults(response.totalHits);
        // Check if there are more images to load
        const totalLoaded = append ? images.length + response.data.length : response.data.length;
        setHasMoreImages(totalLoaded < response.totalHits && response.data.length > 0);
      } else {
        setTotalResults(append ? images.length + response.data.length : response.data.length);
        setHasMoreImages(response.data.length > 0);
      }
      
      if (append) {
        setCurrentPage(page);
      }
    }
    
    setIsLoadingMore(false);
  }

  const loadMoreImages = () => {
    if (!isLoadingMore && hasMoreImages) {
      const nextPage = currentPage + 1;
      fetchimages({
        category: selectedCategory,
        q: searchText,
        image_type: selectedImageType,
        colors: selectedColors.join(','),
        order: selectedOrder,
        page: nextPage
      }, true);
    }
  }

  const handleSearch = (text: string) => {
    setSearchText(text);
    fetchimages({ category: selectedCategory, q: text, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false);
  }

  const handleApplyFilter = () => {
    fetchimages({ category: selectedCategory, q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false);
  }

  const navigateToFilters = () => {
    router.push({
      pathname: '/filters',
      params: {
        imageType: selectedImageType,
        category: selectedCategory,
        colors: selectedColors.join(','),
        order: selectedOrder,
      },
    });
  };

  const handleFloatingButtonPress = () => {
    router.push('/ai-screen');
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <TouchableOpacity style={{ flexDirection: 'row',alignItems:'center' }}>
          <Image source={require('../../assets/images/Appicon.png')}
          style={{
            height:60,
            width:60,
            borderRadius:18
          }} />
          <Text style={styles.logoText}>Pepper</Text>
          <Text style={styles.logoText2}>Wiz</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: wp(3) }}>
          <TouchableOpacity onPress={() => router.push('/favorites')}>
            <FontAwesome6 name="heart" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ gap: hp(2) }}>
        <Animated.View entering={BounceInLeft.duration(699)} style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          justifyContent: 'space-between',
          borderRadius: 18,
          paddingHorizontal: wp(4),
          marginHorizontal: 13,
          paddingVertical: hp(1),
        }}>
          <TouchableOpacity style={{}}>
            <Icon name="search" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={{ flex: 1, marginLeft: wp(2), fontSize: hp(2), outline: 'none' }}
            placeholder='Search for wallpaper or category ...'
            placeholderTextColor="grey"
            autoCapitalize="none"
            autoCorrect={true}
            keyboardType="default"
            value={searchText}
            onChangeText={handleSearch}
            ref={searcinputRef}
          />
          {searchText.length > 0 && (
            <Animated.View entering={BounceInLeft.duration(699)} exiting={FadeOut.duration(500)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { setSearchText(''); fetchimages({ category: selectedCategory, q: '', image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder }, false); }} style={{ padding: wp(2) }}>
                <Icon name="times" size={hp(2.5)} color="black" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
        <Animated.View style={{ flexDirection: 'row', gap: Platform.OS === 'web' ? 2 : wp(2), margin: Platform.OS === "web" ? 4 : wp(1) }}>
          <Catagories
            activeCategory={activeCategory}
            setActiveCategory={handleactiveCategory}
          />
        </Animated.View>
        <View style={{ paddingHorizontal: wp(4), marginBottom: hp(1), flexDirection: 'row', flexWrap: 'wrap', gap: wp(2) }}>
          {/* Display applied filters with discard option */}
          {selectedCategory && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterText}>Category: {selectedCategory}</Text>
              <TouchableOpacity onPress={() => { setSelectedCategory(''); fetchimages({ q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false); }}>
                <Icon name="times" size={14} color="black" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          )}
          {selectedImageType && selectedImageType !== 'all' && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterText}>Type: {selectedImageType}</Text>
              <TouchableOpacity onPress={() => { setSelectedImageType('all'); fetchimages({ category: selectedCategory, q: searchText, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false); }}>
                <Icon name="times" size={14} color="black" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          )}
          {selectedColors.length > 0 && selectedColors.map(color => {
            const colorHexMap: Record<string, string> = {
              grayscale: '#808080',
              transparent: '#FFFFFF',
              red: '#FF0000',
              orange: '#FFA500',
              yellow: '#FFFF00',
              green: '#008000',
              turquoise: '#40E0D0',
              blue: '#0000FF',
              lilac: '#C8A2C8',
              pink: '#FFC0CB',
              white: '#FFFFFF',
              gray: '#808080',
              black: '#000000',
              brown: '#A52A2A',
            };
            return (
              <View key={color} style={[styles.filterBadgecolor, { backgroundColor: colorHexMap[color] || '#ccc' }]}>
                <Text style={[styles.filterText, { color: color === 'yellow' || color === 'white' || color === 'transparent' ? 'black' : 'white' }]}></Text>
                <TouchableOpacity onPress={() => {
                  const newColors = selectedColors.filter(c => c !== color);
                  setSelectedColors(newColors);
                  fetchimages({ category: selectedCategory, q: searchText, image_type: selectedImageType, colors: newColors.join(','), order: selectedOrder, page: 1 }, false);
                }}>
                  <Icon name="times" size={14} color="white" style={{ marginLeft: Platform.OS==='web'?15:10, }} />
                </TouchableOpacity>
              </View>
            );
          })}
          {selectedOrder && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterText}>Order: {selectedOrder}</Text>
              <TouchableOpacity onPress={() => { setSelectedOrder(''); fetchimages({ category: selectedCategory, q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), page: 1 }, false); }}>
                <Icon name="times" size={14} color="black" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View>
          {images.length > 0 && (
            <Imagegrid
              images={images}
            />
          )}
        </View>
        
        {/* Load More Button */}
        {images.length > 0 && hasMoreImages && (
          <View style={styles.loadMoreContainer}>
            <TouchableOpacity
              style={[styles.loadMoreButton, isLoadingMore && styles.loadMoreButtonDisabled]}
              onPress={loadMoreImages}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <Text style={styles.loadMoreText}>Loading...</Text>
              ) : (
                <Text style={styles.loadMoreText}>Load More Images</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {images.length > 0 && !hasMoreImages && (
          <View style={styles.endMessageContainer}>
            <Text style={styles.endMessageText}>No more images to load</Text>
          </View>
        )}
      </ScrollView>
      <BannerAd />
      <View style={styles.floatingButtonsContainer}>
        <FloatingButton 
          onPress={handleFloatingButtonPress}
          imageUri="https://i.pinimg.com/736x/59/cd/b2/59cdb2d00d15b6d2eb09a4e97ffae850.jpg"
          position="center"
        />
        <FloatingButton 
          onPress={() => router.push('/musify')}
          icon="music"
          iconSize={28}
          iconColor="#000"
          position="center"
        />
      </View>
      
      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/favorites');
              }}
            >
              <FontAwesome6 name="heart" size={20} color="#000" />
              <Text style={styles.menuItemText}>Favorites</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/settings');
              }}
            >
              <FontAwesome6 name="gear" size={20} color="#000" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/about');
              }}
            >
              <FontAwesome6 name="circle-info" size={20} color="#000" />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigateToFilters();
              }}
            >
              <FontAwesome6 name="bars-staggered" size={20} color="#000" />
              <Text style={styles.menuItemText}>Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemClose]}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.menuItemCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Platform.OS === 'web' ? 20 : wp(4),
    margin: hp(1),
    alignItems: 'center',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderColor:'black',
    borderWidth: 1
  },
  filterText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 14,
    fontStyle: 'italic'
  },
  logoText2: {
    fontSize: hp(3),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic'
  },
  filterBadgecolor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    width:40,
    height:40,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,

  },
  logoText: {
    fontSize: hp(3),
    fontWeight: '900',
    color: 'grey',
    fontStyle: 'italic'
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: hp(2),
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2),
    paddingHorizontal: wp(4),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#000',
  },
  menuItemClose: {
    borderBottomWidth: 0,
    marginTop: hp(1),
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  menuItemCloseText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#666',
  },
  loadMoreContainer: {
    paddingVertical: hp(3),
    paddingHorizontal: wp(4),
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#000',
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: 18,
    minWidth: wp(60),
    alignItems: 'center',
  },
  loadMoreButtonDisabled: {
    opacity: 0.6,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
  endMessageContainer: {
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  endMessageText: {
    fontSize: hp(1.8),
    color: '#666',
    fontStyle: 'italic',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: hp(3),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
    zIndex: 1000,
  },
});
