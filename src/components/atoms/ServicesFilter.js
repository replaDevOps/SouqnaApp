/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import DownArrowSvg from '../../assets/svg/down-arrow-svg';
import {colors} from '../../util/color';
import {AdjustSVG, TrashSVG} from '../../assets/svg';
import { t } from 'i18next';

const ServicesFilters = ({
  filters,
  setFilters,
  onOpenPriceSheet,
  onOpenServiceTypeSheet,
  onOpenServiceAdjustSheet,
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
      serviceType: '',
    });
    setSortOption(null);
  };

  const filterItems = [
    {
      key: 'adjust',
      render: () => (
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={onOpenServiceAdjustSheet}>
          <AdjustSVG height={16} width={16} />
        </TouchableOpacity>
      ),
    },
    {
      key: 'price',
      render: () => (
        <TouchableOpacity style={styles.input} onPress={onOpenPriceSheet}>
          <View style={styles.inputRow}>
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
            <Text style={styles.filterText} numberOfLines={1} ellipsizeMode="tail">{sortOption || t('sort')}</Text>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
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

export default ServicesFilters;
