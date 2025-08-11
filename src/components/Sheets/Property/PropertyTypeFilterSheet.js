import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {colors} from '../../../util/color';
import CustomText from '../../CustomText';

const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Commercial',
  'Farmhouse',
  'Upper Portion',
  'Lower Portion',
];

const PropertyTypeFilterSheet = ({filters, setFilters, closeSheet}) => {
  const handleSelect = type => {
    setFilters(prev => ({
      ...prev,
      propertyType: type,
    }));
    closeSheet?.();
  };

  return (
    <BottomSheetScrollView contentContainerStyle={styles.container}>
      {PROPERTY_TYPES.map(type => (
        <TouchableOpacity
          key={type}
          onPress={() => handleSelect(type)}
          style={[
            styles.option,
            filters.propertyType === type && styles.selectedOption,
          ]}>
          <CustomText
            style={
              filters.propertyType === type
                ? styles.selectedText
                : styles.optionText
            }>
            {type}
          </CustomText>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: colors.lightgreen || '#00AA88',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PropertyTypeFilterSheet;
