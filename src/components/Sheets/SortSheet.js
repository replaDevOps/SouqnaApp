/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

const options = ['Newest First', 'Oldest First', 'Price: Low to High', 'Price: High to Low'];

const SortSheet = ({sortOption, setSortOption, closeSheet}) => {
  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
        Sort By
      </Text>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => {
            setSortOption(option);
            closeSheet();
          }}
          style={{
            padding: 12,
            backgroundColor: sortOption === option ? '#ddd' : '#f5f5f5',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Text >{option}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};

export default SortSheet;
