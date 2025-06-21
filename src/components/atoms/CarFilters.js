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
import {colors} from '../../util/color';
import {AdjustSVG, TrashSVG} from '../../assets/svg';

const CarFilters = ({
  filters,
  setFilters,
  onOpenBrandSheet,
  onOpenPriceSheet,
  onOpenBuildYearSheet,
  onOpenTransmissionSheet,
  onOpenAdjustSheet,
}) => {
  const getPriceLabel = () => {
    if (filters.minPrice && !filters.maxPrice)
      return `From ${filters.minPrice}`;
    if (!filters.minPrice && filters.maxPrice)
      return `Up to ${filters.maxPrice}`;
    if (filters.minPrice && filters.maxPrice)
      return `${filters.minPrice} - ${filters.maxPrice}`;
    return 'Price';
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      brand: '',
      buildYearMin: '',
      buildYearMax: '',
      transmission: '',
    });
  };

  const filterItems = [
    {
  key: 'adjust',
  render: () => (
    <TouchableOpacity style={styles.resetButton} onPress={onOpenAdjustSheet}>
        {/* <Text style={styles.filterText}>Adjust</Text> */}
        <AdjustSVG height={16} width={16} />
    </TouchableOpacity>
  ),
},

    {
      key: 'price',
      render: () => (
        <TouchableOpacity style={styles.input} onPress={onOpenPriceSheet}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.filterText}>
              {getPriceLabel()}
            </Text>
            <DownArrowSvg />
          </View>
        </TouchableOpacity>
      ),
    },
    {
      key: 'brand',
      render: () => (
        <TouchableOpacity style={styles.input} onPress={onOpenBrandSheet}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Text style={{color: filters.brand ? '#000' : '#888'}}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Text
              style={{
                color:
                  filters.buildYearMin || filters.buildYearMax
                    ? '#000'
                    : '#888',
              }}>
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
    {
      key: 'transmission',
      render: () => (
        <TouchableOpacity
          onPress={onOpenTransmissionSheet}
          style={styles.input}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Text style={{color: filters.brand ? '#000' : '#888'}}>
              {filters.transmission || 'Transmission'}
            </Text>
            <DownArrowSvg />
          </View>
        </TouchableOpacity>
      ),
    },
    {
      key: 'reset',
      render: () => (
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <View style={{flexDirection: 'row', gap: 4}}>
            <TrashSVG height={20} width={20} />
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </View>
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <FlatList
      data={filterItems}
      renderItem={({item}) => item.render()}
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
    height: 35,
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
    color: colors.black,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  resetButton: {
    backgroundColor: colors.lightgreen,
    borderRadius: 20,
    height: 35,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  adjustButton: {
  backgroundColor: '#eee',
  borderRadius: 20,
  height: 35,
  width: 40,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
},

});

export default CarFilters;
