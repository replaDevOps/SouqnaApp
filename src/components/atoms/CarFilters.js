/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import DownArrowSvg from '../../assets/svg/down-arrow-svg';

const CarFilters = ({ filters, setFilters, onOpenBrandSheet, onOpenPriceSheet, onOpenBuildYearSheet }) => {
  const getPriceLabel = () => {
    if (filters.minPrice && !filters.maxPrice) return `From ${filters.minPrice}`;
    if (!filters.minPrice && filters.maxPrice) return `Up to ${filters.maxPrice}`;
    if (filters.minPrice && filters.maxPrice) return `${filters.minPrice} - ${filters.maxPrice}`;
    return 'Price';
  };

  const filterItems = [
    {
      key: 'price',
      render: () => (
        <TouchableOpacity style={styles.input} onPress={onOpenPriceSheet}>
<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
  <Text  
    numberOfLines={1}
    ellipsizeMode="tail"
    style={styles.filterText}>
    {getPriceLabel()}
  </Text>
  <DownArrowSvg  />
</View>

        </TouchableOpacity>
      ),
    },
    {
      key: 'brand',
      render: () => (
        <TouchableOpacity style={styles.input} onPress={onOpenBrandSheet}>
<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
          <Text style={{ color: filters.brand ? '#000' : '#888' }}>
            {filters.brand || 'Brand'}
          </Text>
          <DownArrowSvg />
          </View>
        </TouchableOpacity>
      ),
    },
    {
      key: 'buildYear',
      render: () => (
    <TouchableOpacity style={styles.input} onPress={onOpenBuildYearSheet}>
<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
        <Text style={{ color: (filters.buildYearMin || filters.buildYearMax) ? '#000' : '#888' }}>
          {filters.buildYearMin && filters.buildYearMax
            ? `${filters.buildYearMin} - ${filters.buildYearMax}`
            : filters.buildYearMin
            ? `From ${filters.buildYearMin}`
            : filters.buildYearMax
            ? `Up to ${filters.buildYearMax}`
            : 'Build Year'}
        </Text>
        <DownArrowSvg />
      </View>
    </TouchableOpacity>
      ),
    },
  ];

  return (
    <FlatList
      data={filterItems}
      renderItem={({ item }) => item.render()}
      keyExtractor={item => item.key}
      horizontal
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 5,
  },
  input: {
  backgroundColor: '#f0f0f0',
  borderRadius: 20,
  height: 40,
  width: 120,
  paddingHorizontal: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginRight: 8,
  overflow: 'hidden',
  },
  textInput: {
    textAlign: 'center',
    // fontSize: 16,
  },
  filterText: {
  flexShrink: 1,
  maxWidth: 85,
  fontSize: 14,
  color: '#888',
  includeFontPadding: false,
  textAlignVertical: 'center',
},

});

export default CarFilters;
 