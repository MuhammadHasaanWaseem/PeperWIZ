<<<<<<< HEAD
=======
import FilterActionSheet from '@/ActionSheets/FilterActionSheet';
>>>>>>> master
import { apiCall } from '@/Api/fetchapi';
import Catagories from '@/components/Nested Screens/catagories';
import Imagegrid from '@/components/Nested Screens/Imagegrid';
import { hp, wp } from '@/helpers/dimensions';
import { FontAwesome6 } from '@expo/vector-icons';
<<<<<<< HEAD
import { DebouncedFunc } from 'lodash';
import React, { useEffect } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { BounceInLeft, FadeOut } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
=======
import React, { useEffect } from 'react';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { BounceInLeft, FadeOut } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

>>>>>>> master
const HomeScreen = () => {
  const [searchText, setSearchText] = React.useState('');
  const searcinputRef = React.useRef<TextInput>(null);
  const [activeCategory, setActiveCategory] = React.useState('backgrounds');
  const [images, setImages] = React.useState<any[]>([]);
<<<<<<< HEAD
  const handleactiveCategory = (category: string) => {
    setActiveCategory(category);
=======
  const [filterActionSheetVisible, setFilterActionSheetVisible] = React.useState(false);

  // Filter states
  const [selectedImageType, setSelectedImageType] = React.useState('all');
  const [selectedCategory, setSelectedCategory] = React.useState('backgrounds');
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState('popular');

  const [totalResults, setTotalResults] = React.useState(0);

  const handleactiveCategory = (category: string) => {
    setActiveCategory(category);
    setSelectedCategory(category);
    fetchimages({ category, q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false);
>>>>>>> master
  }

  useEffect(() => {
    const fetchData = async () => {
<<<<<<< HEAD
      await fetchimages();
    };
    fetchData();
    // index.tsx mein, Imagegrid ko pass karne se pehle

  }, [])
  const fetchimages = async (params = { page: 1 }, append = true) => {
    let response = await apiCall(params)

    if (response.success && Array.isArray(response.data)) {

      if (append) {

        setImages(prevImages => [...prevImages, ...response.data]);
      }
      else {
        setImages([...response.data]);
      }

    }
  }
const handleSearch = (text:string) => {
  console.log('Search text:', text);
  }
=======
      await fetchimages({ category: selectedCategory, q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder }, false);
    };
    fetchData();
  }, []);

  const fetchimages = async (params: Record<string, any> = { page: 1 }, append = true) => {
    let response = await apiCall(params);

    if (response.success && Array.isArray(response.data)) {
      if (append) {
        setImages(prevImages => [...prevImages, ...response.data]);
      } else {
        setImages([...response.data]);
      }
      // Set total results if available
      if ('totalHits' in response && typeof response.totalHits === 'number') {
        setTotalResults(response.totalHits);
      } else if (response.data.length !== undefined) {
        setTotalResults(response.data.length);
      }
    }
  }

  const handleSearch = (text: string) => {
    setSearchText(text);
    fetchimages({ category: selectedCategory, q: text, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false);
  }

  const handleApplyFilter = () => {
    fetchimages({ category: selectedCategory, q: searchText, image_type: selectedImageType, colors: selectedColors.join(','), order: selectedOrder, page: 1 }, false);
  }

>>>>>>> master
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.header}>
<<<<<<< HEAD
        <TouchableOpacity style={{ flexDirection: 'row' }}>
          <Text style={styles.logoText}>Pepper</Text>
          <Text style={styles.logoText2}>Wiz</Text>

        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome6 name="bars-staggered" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* You can add more screen content here */}
      <ScrollView
        contentContainerStyle={{ gap: hp(2) }}>

        {/* search bar */}

=======
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
        <TouchableOpacity onPress={() => setFilterActionSheetVisible(true)}>
          <FontAwesome6 name="bars-staggered" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ gap: hp(2) }}>
>>>>>>> master
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
<<<<<<< HEAD
          {/* search for wallpaper */}
=======
>>>>>>> master
          <TextInput
            style={{ flex: 1, marginLeft: wp(2), fontSize: hp(2), outline: 'none' }}
            placeholder='Search for wallpaper or category ...'
            placeholderTextColor="grey"
            autoCapitalize="none"
            autoCorrect={true}
            keyboardType="default"
            value={searchText}
<<<<<<< HEAD
            onChangeText={setSearchText}
            ref={searcinputRef}
          // {onlicking on web}
          />
          {
            searchText.length > 0 && (
              <Animated.View entering={BounceInLeft.duration(699)} exiting={FadeOut.duration(500)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setSearchText('')} style={{ padding: wp(2) }}>
                  <Icon name="times" size={hp(2.5)} color="black" />
                </TouchableOpacity>
              </Animated.View>
            )
          }
        </Animated.View>
        <Animated.View style={{ flexDirection: 'row', gap: Platform.OS === 'web' ? 2 : wp(2), margin: Platform.OS === "web" ? 4 : wp(1) }}>
          {/* Catagories View */}
=======
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
>>>>>>> master
          <Catagories
            activeCategory={activeCategory}
            setActiveCategory={handleactiveCategory}
          />
        </Animated.View>
<<<<<<< HEAD

        {/* images grid */}
=======
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
>>>>>>> master
        <View>
          {images.length > 0 && (
            <Imagegrid
              images={images}
            />
<<<<<<< HEAD
          )
          }

        </View>
      </ScrollView>
=======
          )}
        </View>
      </ScrollView>
      <FilterActionSheet
        visible={filterActionSheetVisible}
        onClose={() => setFilterActionSheetVisible(false)}
        onApply={handleApplyFilter}
        selectedImageType={selectedImageType}
        setSelectedImageType={setSelectedImageType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
>>>>>>> master
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
<<<<<<< HEAD
=======
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
>>>>>>> master
  logoText2: {
    fontSize: hp(3),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic'
<<<<<<< HEAD

  }, logoText: {
=======
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
>>>>>>> master
    fontSize: hp(3),
    fontWeight: '900',
    color: 'grey',
    fontStyle: 'italic'
<<<<<<< HEAD

  },
})
function usesCallback(arg0: DebouncedFunc<(text: string) => void>, arg1: never[]) {
  throw new Error('Function not implemented.');
}

=======
  },
});
>>>>>>> master
