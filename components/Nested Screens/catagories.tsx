// import { wp } from '@/helpers/dimensions';
// import React from 'react';
// import {
//   FlatList,
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
// import { categories } from './categories';

// interface CatagoriesProps {
//   activeCategory: string;
//   setActiveCategory: (category: string) => void;
// }

// const Catagories: React.FC<CatagoriesProps> = ({
//   activeCategory,
//   setActiveCategory,
// }) => {
//   return (
//     <View style={styles.wrapper}>
//       <FlatList
//         data={categories}
//         horizontal
//         showsHorizontalScrollIndicator={Platform.OS === 'web'}
//         scrollEnabled={true} //for web?
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         //scroolable
        
//         renderItem={({ item, index }) => (
//           <CategoryView
//             item={item}
//             index={index}
//             activeCategory={activeCategory}
//             setActiveCategory={setActiveCategory}
//           />
//         )}
//       />
//     </View>
//   );
// };

// interface CategoryViewProps {
//   item: { id: string; name: string };
//   index: number;
//   activeCategory: string;
//   setActiveCategory: (category: string) => void;
// }

// const CategoryView: React.FC<CategoryViewProps> = ({
//   item,
//   index,
//   activeCategory,
//   setActiveCategory,
// }) => {
//   const isActive = activeCategory === item.id;

//   return (
//     <Animated.View
//       entering={FadeInRight.delay(index * 150).springify().damping(5)}
//       style={styles.itemContainer}
//     >
//       <TouchableOpacity
//         style={[
//           styles.button,
//           {
//             backgroundColor: isActive ? 'black' : '#00F0AB',
//             width: Platform.OS === 'web' ? 120 : wp(30),
//             paddingVertical: Platform.OS === 'web' ? 10 : 8,
//           },
//         ]}
//         onPress={() => setActiveCategory(item.id)}
//       >
//         <Animated.Text
//           entering={FadeInUp.delay(index * 100).duration(600).damping(2)}
//           style={[
//             styles.text,
//             { color: isActive ? 'white' : 'black' },
//           ]}
//         >
//           {item.name}
//         </Animated.Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     marginBottom: Platform.OS === 'web' ? 15 : wp(2),
//   },
//   listContainer: {
//     paddingHorizontal: Platform.OS === 'web' ? 20 : wp(2),
//     gap: Platform.OS === 'web' ? 12 : 0,
//   },
//   itemContainer: {
//     marginRight: Platform.OS === 'web' ? 12 : 10,
//   },
//   button: {
//     borderRadius: 14,
//     paddingHorizontal: 5,
//   },
//   text: {
//     fontSize: Platform.OS === 'web' ? 16 : 14,
//     textAlign: 'center',
//     fontWeight: '900',
//   },
// });

// export default Catagories;
import { wp } from '@/helpers/dimensions';
import React from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { categories } from './categories';

interface CatagoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const Catagories: React.FC<CatagoriesProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  if (Platform.OS === 'web') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.wrapper}
        contentContainerStyle={styles.webListContainer}
        // numberofrows
        scrollEnabled={true} //for web?
        
      >
        {categories.map((item, index) => (
          <CategoryView
            key={item.id}
            item={item}
            index={index}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <CategoryView
            item={item}
            index={index}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        )}
      />
    </View>
  );
};

interface CategoryViewProps {
  item: { id: string; name: string };
  index: number;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  item,
  index,
  activeCategory,
  setActiveCategory,
}) => {
  const isActive = activeCategory === item.id;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 120).springify().damping(4)}
      style={styles.itemContainer}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isActive ? '#000000' : '#E0F7EF',
            shadowOpacity: isActive ? 0.25 : 0.1,
            width: Platform.OS === 'web' ? 'auto' : wp(30),
            paddingVertical: Platform.OS === 'web' ? 10 : 8,
          },
        ]}
        onPress={() => setActiveCategory(item.id)}
      >
        <Animated.Text
          entering={FadeInUp.delay(index * 100).duration(500).damping(2)}
          style={[
            styles.text,
            {
              color: isActive ? '#FFFFFF' : '#333',
            },
          ]}
        >
          {item.name}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Platform.OS === 'web' ? 20 : wp(2),
  },
  webListContainer: {
    paddingHorizontal: 20,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: wp(2),
  },
  itemContainer: {
    marginRight: 10,
  },
  button: {
    borderRadius: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  // /  transition: 'all 0.3s ease-in-out', // works only on web
    cursor: Platform.OS === 'web' ? 'pointer' : undefined,
  },
  text: {
    fontSize: Platform.OS === 'web' ? 15 : 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

<<<<<<< HEAD
export default Catagories;
=======
export default Catagories;
>>>>>>> master
