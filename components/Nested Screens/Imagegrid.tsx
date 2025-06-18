import { getcoloumncount, wp } from '@/helpers/dimensions';
import { MasonryFlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ImageCard from './ImageCard';

const Imagegrid = ({ images }: { images: any[] }) => {
  const coloumn = getcoloumncount();
  return (
    <View style={style.container}>
      <MasonryFlashList
        data={images}
        numColumns={coloumn}
        estimatedItemSize={200} // Adjust based on your image sizes
        contentContainerStyle={style.listcontainer}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ImageCard item={item} index={index} />
        )}
      />
    </View>
  );
};

export default Imagegrid;

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: wp(100),
  },
  listcontainer: {
    paddingHorizontal: wp(2), // less padding for tighter grid
  },
});
