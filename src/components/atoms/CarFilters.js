// components/Filters/CarFilters.js
import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const CarFilters = ({filters, setFilters}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Min Price"
        keyboardType="numeric"
        value={filters.minPrice}
        onChangeText={text => setFilters(prev => ({...prev, minPrice: text}))}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Price"
        keyboardType="numeric"
        value={filters.maxPrice}
        onChangeText={text => setFilters(prev => ({...prev, maxPrice: text}))}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={filters.brand}
        onChangeText={text => setFilters(prev => ({...prev, brand: text}))}
      />
      <TextInput
        style={styles.input}
        placeholder="Build Year"
        keyboardType="numeric"
        value={filters.buildYear}
        onChangeText={text => setFilters(prev => ({...prev, buildYear: text}))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10,
    gap: 5,
    flexWrap: 'wrap',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 8,
    flex: 1,
    minWidth: '20%',
  },
});

export default CarFilters;
