import { wp } from '@/helpers/dimensions'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated'
import { categories } from './categories'

interface CatagoriesProps {
  activeCategory: string
  setActiveCategory: (category: string) => void
}

const Catagories: React.FC<CatagoriesProps> = ({index, activeCategory, setActiveCategory }:any) => {
  return (
    <Animated.View entering={FadeInRight.delay(index*200).springify().damping(2)}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <CategoryView
            item={item}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        )}
      />
    </Animated.View>
  )
}

interface CategoryViewProps {
  item: { id: string; name: string }
  activeCategory: string
  setActiveCategory: (category: string) => void
}

const CategoryView: React.FC<CategoryViewProps> = ({ item, activeCategory, setActiveCategory }) => {
  const isActive = activeCategory === item.id

  return (
    <Animated.View
      entering={FadeInRight.duration(600).damping(2)}
      style={styles.itemContainer}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isActive ? 'black' : '#00F0AB' }
        ]}
        onPress={() => setActiveCategory(item.id)}
      >
        <Animated.Text
          entering={FadeInUp.duration(600).damping(2)}
          style={[
            styles.text,
            { color: isActive ? 'white' : 'black' }
          ]}
        >
          {item.name}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: wp(2),
  },
  itemContainer: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
  },
  button: {
    padding: 10,
    borderRadius: 14,
    width: wp(30),
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '900',
  },
})

export default Catagories
