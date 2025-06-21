import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const ServiceAdjustFilterSheet = ({ filters, setFilters, closeSheet }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>Education Required</Text>
      <TextInput
        placeholder="e.g. Bachelor"
        style={inputStyle}
        value={filters.educationRequired}
        onChangeText={text => setFilters(prev => ({ ...prev, educationRequired: text }))}
      />

      <Text style={{ fontWeight: 'bold' }}>Experience Required</Text>
      <TextInput
        placeholder="e.g. 2 Years"
        style={inputStyle}
        value={filters.experienceRequired}
        onChangeText={text => setFilters(prev => ({ ...prev, experienceRequired: text }))}
      />

      <Text style={{ fontWeight: 'bold' }}>Gender Preference</Text>
      <TextInput
        placeholder="e.g. Any"
        style={inputStyle}
        value={filters.genderPreference}
        onChangeText={text => setFilters(prev => ({ ...prev, genderPreference: text }))}
      />
    </BottomSheetScrollView>
  );
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 20,
};

export default ServiceAdjustFilterSheet;
