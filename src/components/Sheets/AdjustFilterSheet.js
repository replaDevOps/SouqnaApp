import React from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import { colors } from '../../util/color';

const sectionTitleStyle = {
  fontSize: 16,
  fontWeight: 'bold',
  marginVertical: 12,
};

const labelStyle = {
  fontSize: 14,
  marginBottom: 6,
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 8,
  marginBottom: 12,
};

const resetButtonStyle = {
  marginTop: 20,
  alignSelf: 'center',
};

const AdjustFilterSheet = ({
  filters,
  setFilters,
  onOpenBrandSheet,
  onOpenPriceSheet,
  onOpenTransmissionSheet,
  onOpenBuildYearSheet,
}) => {
  const resetFilters = () => {
    setFilters({
      brand: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      buildYearMin: '',
      buildYearMax: '',
      minMileage: '',
      maxMileage: '',
      fuelType: '',
      transmission: '',
      location: '',
      color: '',
      power: '',
      condition: '',
      inspection: '',
    });
  };
  return (
    <BottomSheetScrollView
      contentContainerStyle={{padding: 20, paddingBottom: 60}}>
      {/* --- BASIC FILTERS --- */}
      <Text style={sectionTitleStyle}>Basic Filters</Text>

      {/* Brand */}
      <Text style={labelStyle}>Brand / Make</Text>
      <TouchableOpacity
        onPress={onOpenBrandSheet}
        style={[inputStyle, {justifyContent: 'center'}]}>
        <Text>{filters.brand || 'Select brand'}</Text>
      </TouchableOpacity>

      {/* Model */}
      <Text style={labelStyle}>Model</Text>
      <TextInput
        placeholder="Enter model"
        value={filters.model}
        onChangeText={text => setFilters(prev => ({...prev, model: text}))}
        style={inputStyle}
      />

      {/* Price Range */}
      <Text style={labelStyle}>Price Range</Text>
      <TouchableOpacity
        onPress={onOpenPriceSheet}
        style={[inputStyle, {justifyContent: 'center'}]}>
        <Text>
          {filters.minPrice || filters.maxPrice
            ? `${filters.minPrice ? `From ${filters.minPrice}` : ''} ${
                filters.maxPrice ? `Up to ${filters.maxPrice}` : ''
              }`.trim()
            : 'Select price range'}
        </Text>
      </TouchableOpacity>

      {/* Year Range */}
      <Text style={labelStyle}>Year Range</Text>
      <TouchableOpacity
        onPress={onOpenBuildYearSheet}
        style={[inputStyle, {justifyContent: 'center'}]}>
        <Text>
          {filters.buildYearMin || filters.buildYearMax
            ? `${filters.buildYearMin ? `From ${filters.buildYearMin}` : ''} ${
                filters.buildYearMax ? `Up to ${filters.buildYearMax}` : ''
              }`.trim()
            : 'Select year range'}
        </Text>
      </TouchableOpacity>

      {/* Mileage Range */}
      <Text style={labelStyle}>Mileage Range</Text>
      <View style={{flexDirection: 'row', gap: 10}}>
        <TextInput
          placeholder="Min (km)"
          keyboardType="numeric"
          value={filters.minMileage}
          onChangeText={text =>
            setFilters(prev => ({...prev, minMileage: text}))
          }
          style={[inputStyle, {flex: 1}]}
        />
        <TextInput
          placeholder="Max (km)"
          keyboardType="numeric"
          value={filters.maxMileage}
          onChangeText={text =>
            setFilters(prev => ({...prev, maxMileage: text}))
          }
          style={[inputStyle, {flex: 1}]}
        />
      </View>

      {/* Fuel Type */}
      <Text style={labelStyle}>Fuel Type</Text>
      {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => setFilters(prev => ({...prev, fuelType: option}))}
          style={{
            padding: 10,
            backgroundColor: filters.fuelType === option ? colors.lightgreen : '#f5f5f5',
            borderRadius: 8,
            marginBottom: 8,
          }}>
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}

      {/* Transmission */}
      <Text style={labelStyle}>Transmission</Text>
      <TouchableOpacity
        onPress={onOpenTransmissionSheet}
        style={[inputStyle, {justifyContent: 'center'}]}>
        <Text>{filters.transmission || 'Select transmission'}</Text>
      </TouchableOpacity>

      {/* Location (from registrationCity) */}
      <Text style={labelStyle}>Location</Text>
      <TextInput
        placeholder="Enter location"
        value={filters.location}
        onChangeText={text => setFilters(prev => ({...prev, location: text}))}
        style={inputStyle}
      />

      {/* --- ADDITIONAL FILTERS --- */}
      <Text style={sectionTitleStyle}>Additional Filters</Text>

      {/* Color */}
      <Text style={labelStyle}>Color</Text>
      <TextInput
        placeholder="Enter color"
        value={filters.color}
        onChangeText={text => setFilters(prev => ({...prev, color: text}))}
        style={inputStyle}
      />

      {/* Power */}
      <Text style={labelStyle}>Power (HP/kW)</Text>
      <TextInput
        placeholder="Enter power"
        keyboardType="numeric"
        value={filters.power}
        onChangeText={text => setFilters(prev => ({...prev, power: text}))}
        style={inputStyle}
      />

      {/* Condition (not in fields but OK to keep) */}
      <Text style={labelStyle}>Condition</Text>
      {['Used', 'New'].map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => setFilters(prev => ({...prev, condition: option}))}
          style={{
            padding: 10,
            backgroundColor: filters.condition === option ? colors.lightgreen : '#f5f5f5',
            borderRadius: 8,
            marginBottom: 8,
          }}>
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}

      {/* Inspection Validity */}
      <Text style={labelStyle}>Inspection Validity</Text>
      <TextInput
        placeholder="Valid till (e.g. 2026)"
        value={filters.inspection}
        onChangeText={text => setFilters(prev => ({...prev, inspection: text}))}
        style={inputStyle}
      />

      {/* --- RESET FILTERS BUTTON --- */}
      <TouchableOpacity onPress={resetFilters} style={resetButtonStyle}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>Reset Filters</Text>
      </TouchableOpacity>
    </BottomSheetScrollView>
  );
};

export default AdjustFilterSheet;
