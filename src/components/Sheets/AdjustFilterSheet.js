/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  sectionTitleStyle,
  inputStyle,
  labelStyle,
  resetButtonStyle,
} from '../../util/Filtering/filterStyles';
import GooglePlacesSuggestion from '../../components/GooglePlacesSuggestion';
const AdjustFilterSheet = ({
  filters,
  setFilters,
  onOpenBrandSheet,
  onOpenPriceSheet,
  onOpenTransmissionSheet,
  onOpenBuildYearSheet,
}) => {
  useEffect(() => {
    if (fuelOpen) setConditionOpen(false);
  }, [fuelOpen]);

  useEffect(() => {
    if (conditionOpen) setFuelOpen(false);
  }, [conditionOpen]);

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
      lat: '',
      long: '',
    });
  };

  const [fuelOpen, setFuelOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  const [fuelItems, setFuelItems] = useState([
    {label: 'Petrol', value: 'Petrol'},
    {label: 'Diesel', value: 'Diesel'},
    {label: 'Hybrid', value: 'Hybrid'},
    {label: 'Electric', value: 'Electric'},
  ]);

  const [conditionItems, setConditionItems] = useState([
    {label: 'Used', value: 'Used'},
    {label: 'New', value: 'New'},
  ]);

  return (
    <View style={{flex: 1, zIndex: 0}}>
      <BottomSheetScrollView
        contentContainerStyle={{padding: 20, paddingBottom: 60}}>
        {/* --- BASIC FILTERS --- */}
        <Text style={sectionTitleStyle}>Basic Filters</Text>

        {/* Brand */}
        <Text style={labelStyle}>Brand / Make</Text>
        <TouchableOpacity
          onPress={() => {
            onOpenBrandSheet?.(); // this should be passed from parent
          }}
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
              ? `${
                  filters.buildYearMin ? `From ${filters.buildYearMin}` : ''
                } ${
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
        <View
          style={{
            zIndex: fuelOpen ? 1000 : 1,
            position: 'relative',
            elevation: fuelOpen ? 10 : 0,
          }}>
          <DropDownPicker
            open={fuelOpen}
            value={filters.fuelType}
            items={fuelItems}
            setOpen={setFuelOpen}
            setValue={val => setFilters(prev => ({...prev, fuelType: val()}))}
            setItems={setFuelItems}
            placeholder="Select fuel type"
            style={[inputStyle, {marginBottom: fuelOpen ? 120 : 12}]}
            dropDownContainerStyle={{
              ...inputStyle,
              marginBottom: 12,
            }}
          />
        </View>

        {/* Transmission */}
        <Text style={labelStyle}>Transmission</Text>
        <TouchableOpacity
          onPress={onOpenTransmissionSheet}
          style={[inputStyle, {justifyContent: 'center'}]}>
          <Text>{filters.transmission || 'Select transmission'}</Text>
        </TouchableOpacity>

        {/* Location (from registrationCity) */}
        {/* <Text style={labelStyle}>Location</Text>
        <TextInput
          placeholder="Enter location"
          value={filters.location}
          onChangeText={text => setFilters(prev => ({...prev, location: text}))}
          style={inputStyle}
        /> */}

        {/* <Text style={labelStyle}>Location</Text> */}
        {/* <View style={inputStyle}>
  <GooglePlacesSuggestion
    initialValue={filters.location}
    onPlaceSelected={({location, lat, long}) => {
      setFilters(prev => ({
        ...prev,
        location,
        lat,
        long,
      }));
    }}
  />
</View> */}

        {/* --- ADDITIONAL FILTERS --- */}
        <Text style={sectionTitleStyle}>Additional Filters</Text>

        {/* Color */}
        {/* <Text style={labelStyle}>Color</Text>
        <TextInput
          placeholder="Enter color"
          value={filters.color}
          onChangeText={text => setFilters(prev => ({...prev, color: text}))}
          style={inputStyle}
        /> */}

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
        {/* <Text style={labelStyle}>Condition</Text>
<View style={{zIndex: conditionOpen ? 999 : 1, position: 'relative', elevation: conditionOpen ? 10 : 0}}>
          <DropDownPicker
            open={conditionOpen}
            value={filters.condition}
            items={conditionItems}
            setOpen={setConditionOpen}
            setValue={val => setFilters(prev => ({...prev, condition: val()}))}
            setItems={setConditionItems}
            placeholder="Select condition"
            style={[inputStyle, {marginBottom: conditionOpen ? 120 : 12}]}
            dropDownContainerStyle={{
              ...inputStyle,
              marginBottom: 12,
            }}
          />
        </View> */}

        {/* Inspection Validity */}
        <Text style={labelStyle}>Inspection Validity</Text>
        <TextInput
          placeholder="Valid till (e.g. 2026)"
          value={filters.inspection}
          onChangeText={text =>
            setFilters(prev => ({...prev, inspection: text}))
          }
          style={inputStyle}
        />

        {/* --- RESET FILTERS BUTTON --- */}
        <TouchableOpacity onPress={resetFilters} style={resetButtonStyle}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>Reset Filters</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </View>
  );
};

export default AdjustFilterSheet;
