import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply?: () => void;
  selectedImageType: string;
  setSelectedImageType: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedColors: string[];
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOrder: string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>;
}

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

const FilterActionSheet: React.FC<FilterActionSheetProps> = ({
  visible,
  onClose,
  onApply,
  selectedImageType,
  setSelectedImageType,
  selectedCategory,
  setSelectedCategory,
  selectedColors,
  setSelectedColors,
  selectedOrder,
  setSelectedOrder,
}) => {
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Filter by Image Type</Text>
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
                  ]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Filter by Category</Text>
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
                  ]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Filter by Colors</Text>
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
                    {isSelected && <Text style={[styles.checkmark, {color: color.textColor}]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Order Results</Text>
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
                  ]}>{order}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={() => { if(onApply) onApply(); onClose(); }}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeAllButton} onPress={() => {
              setSelectedImageType('all');
              setSelectedCategory('');
              setSelectedColors([]);
              setSelectedOrder('popular');
              if(onApply) onApply();
              onClose();
            }}>
              <Text style={styles.removeAllText}>Remove All Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Discard</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'white',
    elevation: 5
  },
  scrollContent: {
    paddingBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#888',
    margin: 4
  },
  optionButtonSelected: {
    backgroundColor: 'black'
  },
  optionText: {
    color: '#333',
    fontSize: 14
  },
  optionTextSelected: {
    color: 'white'
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'black',
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: 'center'
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  colorOptionButton: {
    width: 30,
    height: 30,
    borderRadius: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black'
  },
  colorOptionButtonSelected: {
    borderColor: '#007AFF',
    borderWidth: 2
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold'
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center'
  },
  applyButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
  removeAllButton: {
    marginTop: 20,
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:'black',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  removeAllText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default FilterActionSheet;
