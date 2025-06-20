import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

const options = ['Automatic', 'Manual'];

const TransmissionFilterSheet = ({filters, setFilters, closeSheet}) => {
  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
        Select Transmission
      </Text>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => {
            setFilters(prev => ({...prev, transmission: option}));
            closeSheet();
          }}
          style={{
            padding: 12,
            backgroundColor:
              filters.transmission === option ? '#ddd' : '#f5f5f5',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};

export default TransmissionFilterSheet;
