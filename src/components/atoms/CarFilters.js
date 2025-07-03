/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import DownArrowSvg from '../../assets/svg/down-arrow-svg';
import {colors} from '../../util/color';
import {AdjustSVG, TrashSVG} from '../../assets/svg';
import {t} from 'i18next';

const CarFilters = ({
  filters,
  setFilters,
  onOpenBrandSheet,
  onOpenPriceSheet,
  onOpenBuildYearSheet,
  onOpenTransmissionSheet,
  onOpenAdjustSheet,
  sortOption,
  onOpenSortSheet,
  setSortOption,
}) => {
  const getPriceLabel = () => {
    if (filters.minPrice && !filters.maxPrice)
      return `From ${filters.minPrice}`;
    if (!filters.minPrice && filters.maxPrice)
      return `Up to ${filters.maxPrice}`;
    if (filters.minPrice && filters.maxPrice)
      return `${filters.minPrice} - ${filters.maxPrice}`;
    return t('price');
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
    setSortOption(null);
  };

  const filterItems = [
    {
      key: 'adjust',
      render: () => (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={onOpenAdjustSheet}>
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
<Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={{color: '#000', flex: 1, marginRight: 8}}>
  {filters.brand?.length > 0
    ? filters.brand.join(', ')
    : t('brand')}
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
                color: '#000',
              }}>
              {filters.buildYearMin && filters.buildYearMax
                ? `${filters.buildYearMin} - ${filters.buildYearMax}`
                : filters.buildYearMin
                ? `From ${filters.buildYearMin}`
                : filters.buildYearMax
                ? `Up to ${filters.buildYearMax}`
                : t('buildyear')}
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
            <Text style={{color: '#000'}}>
              {filters.transmission || t('transmission')}
            </Text>
            <DownArrowSvg />
          </View>
        </TouchableOpacity>
      ),
    },
    {
      key: 'sort',
      render: () => (
        <TouchableOpacity onPress={onOpenSortSheet} style={styles.input}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Text
              style={styles.filterText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {sortOption || t('sort')}
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
            <Text style={styles.resetButtonText}>{t('resetfilters')}</Text>
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
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    height: 35,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    color: colors.black,
    // fontWeight: 'bold',
  },
  sortButtonCentered: {
    gap: 5,
    flexDirection: 'row',
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightgreen, // your desired color
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    // elevation: 5,
    zIndex: 999,
  },
  sortDropdown: {
    position: 'absolute',
    top: 40, // Below the button
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    zIndex: 999,
    paddingVertical: 6,
  },

  sortOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },

  sortButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
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
