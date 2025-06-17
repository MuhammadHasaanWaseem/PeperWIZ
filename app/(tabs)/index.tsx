import { apiCall } from '@/Api/fetchapi';
import Catagories from '@/components/Nested Screens/catagories';
import Imagegrid from '@/components/Nested Screens/Imagegrid';
import { hp, wp } from '@/helpers/dimensions';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { BounceInLeft, FadeOut } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomeScreen = () => {
  const [searchText, setSearchText] = React.useState('');
  const searcinputRef = React.useRef<TextInput>(null);
  const [activeCategory, setActiveCategory] = React.useState('backgrounds');
  const [images, setImages] = React.useState<any[]>([]);
  const handleactiveCategory = (category: string) => {
    setActiveCategory(category);}
  useEffect(()=>{
    const fetchData = async () => {
      await fetchimages();
    };
    fetchData();
 // index.tsx mein, Imagegrid ko pass karne se pehle

  }, [])  
const fetchimages = async (params={page:1} ,append=true)=> {
  let response =await apiCall(params)

  if(response.success && Array.isArray(response.data)) {
    
      if (append) {
       
        setImages(prevImages => [...prevImages, ...response.data]);
      }
      else {
        setImages([...response.data]);
      }
    
  } else {
    console.log('No hits found or response unsuccessful');
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{flexDirection:'row'}}>
          <Text style={styles.logoText}>Pepper</Text>
          <Text style={styles.logoText2}>Wiz</Text>

        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome6 name="bars-staggered" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* You can add more screen content here */}
      <ScrollView
      contentContainerStyle={{gap: hp(2), paddingHorizontal: wp(2)}}>

        {/* search bar */}
        
<Animated.View entering={BounceInLeft.duration(699)} style={{flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  }}>
  <TouchableOpacity style={{}}>
    <Icon name="search" size={24} color="black" />
  </TouchableOpacity>
  {/* search for wallpaper */}
  <TextInput
  style={{flex: 1, marginLeft: wp(2), fontSize: hp(2)}}
  placeholder='Search for wallpaper or category ...'
  placeholderTextColor="grey"
  autoCapitalize="none"
  autoCorrect={true}
  keyboardType="default"
  value={searchText}
  onChangeText={setSearchText}
  ref={searcinputRef}
  />
   {
    searchText.length > 0 && (
      <Animated.View entering={BounceInLeft.duration(699)} exiting={FadeOut.duration(500)} style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => setSearchText('')} style={{padding: wp(2)}}>
        <Icon name="times" size={hp(2.5)} color="black" /> 
      </TouchableOpacity>
      </Animated.View>
    )
   }
</Animated.View>
<Animated.View style={{flexDirection: 'row', gap: wp(2),margin:wp(1)}}>
  {/* Catagories View */}
  <Catagories
  activeCategory={activeCategory}
  setActiveCategory={handleactiveCategory}
  />
</Animated.View>

{/* images grid */}
<View>
{images.length > 0 &&( 
<Imagegrid
  images={images}
  />
   ) 
}

</View>
      </ScrollView>
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
    padding: wp(4),
    margin: hp(1),
    alignItems: 'center',
  },
  logoText2: {
    fontSize: hp(3),
    fontWeight: '900',
    color: '#000',
    fontStyle:'italic'

  },logoText: {
    fontSize: hp(3),
    fontWeight: '900',
    color: 'grey',
    fontStyle:'italic'

  },
})
