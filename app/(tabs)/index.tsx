import { hp, wp } from '@/helpers/dimensions';
import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.logoText}>PepperWiz</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome6 name="bars-staggered" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* You can add more screen content here */}
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
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
  },
})
