import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const industries = ['Healthcare', 'IT', 'Construction', 'Education', 'Other'];

const ServiceTypeFilterSheet = ({ filters, setFilters, closeSheet }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
      {industries.map(industry => (
        <TouchableOpacity
          key={industry}
          onPress={() => {
            setFilters(prev => ({ ...prev, serviceType: industry }));
            closeSheet?.();
          }}
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderColor: '#eee',
          }}>
          <Text>{industry}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};

export default ServiceTypeFilterSheet;
