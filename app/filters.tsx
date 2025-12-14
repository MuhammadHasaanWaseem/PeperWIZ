import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { hp, wp } from '@/helpers/dimensions';
import Animated, { FadeIn } from 'react-native-reanimated';

const imageTypes = ['all', 'photo', 'illustration', 'vector'];
const categories = [
  'backgrounds', 'fashion', 'nature', 'science', 'education', 'feelings', 'health', 'people',
  'religion', 'places', 'animals', 'industry', 'computer', 'food', 'sports', 'transportation',
  'travel', 'buildings', 'business', 'music'
];
const colors = [
  { name: 'grayscale', hex: '#808080', textColor: '#000' },
  { name: 'transparent', hex: '#FFFFFF', textColor: '#000' },
  { name: 'red', hex: '#FF0000', textColor: '#fff' },
  { name: 'orange', hex: '#FFA500', textColor: '#fff' },
  { name: 'yellow', hex: '#FFFF00', textColor: '#000' },
  { name: 'green', hex: '#008000', textColor: '#fff' },
  { name: 'turquoise', hex: '#40E0D0', textColor: '#fff' },
  { name: 'blue', hex: '#0000FF', textColor: '#fff' },
  { name: 'lilac', hex: '#C8A2C8', textColor: '#000' },
  { name: 'pink', hex: '#FFC0CB', textColor: '#000' },
  { name: 'white', hex: '#FFFFFF', textColor: '#000' },
  { name: 'gray', hex: '#808080', textColor: '#fff' },
  { name: 'black', hex: '#000000', textColor: '#fff' },
  { name: 'brown', hex: '#A52A2A', textColor: '#fff' },
];
const orders = ['popular', 'latest'];

const FiltersScreen = () => {
  const params = useLocalSearchParams();
  
  const [selectedImageType, setSelectedImageType] = useState(
    (params.imageType as string) || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState(
    (params.category as string) || ''
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    params.colors ? (params.colors as string).split(',') : []
  );
  const [selectedOrder, setSelectedOrder] = useState(
    (params.order as string) || 'popular'
  );

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleApply = () => {
    // Navigate back with filter params
    router.back();
    // Use a small delay to ensure navigation completes before setting params
    setTimeout(() => {
      router.setParams({
        imageType: selectedImageType,
        category: selectedCategory,
        colors: selectedColors.join(','),
        order: selectedOrder,
        applied: 'true',
      });
    }, 100);
  };

  const handleRemoveAll = () => {
    setSelectedImageType('all');
    setSelectedCategory('');
    setSelectedColors([]);
    setSelectedOrder('popular');
  };

  const hasActiveFilters = () => {
    return (
      selectedImageType !== 'all' ||
      selectedCategory !== '' ||
      selectedColors.length > 0 ||
      selectedOrder !== 'popular'
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Filters</Text>
        </View>
        {hasActiveFilters() && (
          <TouchableOpacity onPress={handleRemoveAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
        {!hasActiveFilters() && <View style={{ width: 60 }} />}
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          {/* Image Type Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Image Type</Text>
            <View style={styles.optionsContainer}>
              {imageTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    selectedImageType === type && styles.optionButtonSelected
                  ]}
                  onPress={() => setSelectedImageType(type)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedImageType === type && styles.optionTextSelected
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.optionsContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.optionButton,
                    selectedCategory === category && styles.optionButtonSelected
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedCategory === category && styles.optionTextSelected
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Colors Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Colors</Text>
            <View style={styles.optionsContainer}>
              {colors.map(color => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <TouchableOpacity
                    key={color.name}
                    style={[
                      styles.colorOptionButton,
                      { backgroundColor: color.hex },
                      isSelected && styles.colorOptionButtonSelected
                    ]}
                    onPress={() => toggleColor(color.name)}
                  >
                    {isSelected && (
                      <Text style={[styles.checkmark, { color: color.textColor }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Order Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.optionsContainer}>
              {orders.map(order => (
                <TouchableOpacity
                  key={order}
                  style={[
                    styles.optionButton,
                    selectedOrder === order && styles.optionButtonSelected
                  ]}
                  onPress={() => setSelectedOrder(order)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOrder === order && styles.optionTextSelected
                  ]}>
                    {order.charAt(0).toUpperCase() + order.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.removeAllButton]}
          onPress={handleRemoveAll}
        >
          <Text style={styles.removeAllText}>Remove All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.applyButton]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FiltersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 20 : wp(4),
    margin: hp(1),
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp(3),
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  clearButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
  },
  clearButtonText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#000',
  },
  content: {
    paddingBottom: hp(10),
    paddingHorizontal: wp(4),
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: '900',
    color: '#000',
    marginBottom: hp(1.5),
    fontStyle: 'italic',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  optionButton: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: hp(0.8),
  },
  optionButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    color: '#666',
    fontSize: hp(1.8),
    fontWeight: '700',
  },
  optionTextSelected: {
    color: '#fff',
  },
  colorOptionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: hp(0.8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorOptionButtonSelected: {
    borderColor: '#000',
    borderWidth: 3,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: wp(3),
  },
  footerButton: {
    flex: 1,
    paddingVertical: hp(2),
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    backgroundColor: '#000',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
  removeAllButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  removeAllText: {
    color: '#000',
    fontSize: hp(2),
    fontWeight: '700',
  },
});

