/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, View, TextInput, Switch, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';

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

const PropertyAdjustFilterSheet = ({filters, setFilters}) => {
  const updateField = (key, value) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const [heatingCoolingOpen, setHeatingCoolingOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const heatingCoolingItems = [
    {label: 'Installed', value: 'Installed'},
    {label: 'Not Installed', value: 'Not Installed'},
  ];

  const availabilityItems = [
    {label: 'Available', value: 'Available'},
    {label: 'Not Available', value: 'Not Available'},
  ];

  return (
    <View style={{flex: 1}}>
      <BottomSheetScrollView
        contentContainerStyle={{padding: 20, paddingBottom: 60}}>
        {/* --- BASIC FILTERS --- */}
        <Text style={sectionTitleStyle}>Basic Filters</Text>

        {/* Property Type */}
        <Text style={labelStyle}>Property Type</Text>
        <TextInput
          value={filters.propertyType || ''}
          onChangeText={text => updateField('propertyType', text)}
          placeholder="e.g. Villa, Apartment"
          style={inputStyle}
        />

        {/* Purpose */}
        <Text style={labelStyle}>Purpose</Text>
        <TextInput
          value={filters.purpose || ''}
          onChangeText={text => updateField('purpose', text)}
          placeholder="e.g. For Sale, For Rent"
          style={inputStyle}
        />

        {/* Size */}
        <Text style={labelStyle}>Size</Text>
        <TextInput
          value={filters.size || ''}
          onChangeText={text => updateField('size', text)}
          placeholder="e.g. 1 Kanal, 10 Marla"
          style={inputStyle}
        />

        {/* Rooms */}
        <Text style={labelStyle}>Rooms</Text>
        <TextInput
          value={filters.rooms || ''}
          onChangeText={text => updateField('rooms', text)}
          keyboardType="numeric"
          placeholder="e.g. 4"
          style={inputStyle}
        />

        {/* Bathrooms */}
        <Text style={labelStyle}>Bathrooms</Text>
        <TextInput
          value={filters.bathrooms || ''}
          onChangeText={text => updateField('bathrooms', text)}
          keyboardType="numeric"
          placeholder="e.g. 2"
          style={inputStyle}
        />

        {/* --- ADDITIONAL FILTERS --- */}
        <Text style={sectionTitleStyle}>Additional Filters</Text>

        {/* Floor Number */}
        <Text style={labelStyle}>Floor Number</Text>
        <TextInput
          value={filters.floorNumber || ''}
          onChangeText={text => updateField('floorNumber', text)}
          keyboardType="numeric"
          placeholder="e.g. 1"
          style={inputStyle}
        />

        {/* Total Floors */}
        <Text style={labelStyle}>Total Floors in Building</Text>
        <TextInput
          value={filters.totalFloorsInBuilding || ''}
          onChangeText={text => updateField('totalFloorsInBuilding', text)}
          keyboardType="numeric"
          placeholder="e.g. 5"
          style={inputStyle}
        />

        {/* Heating/Cooling */}
        <Text style={labelStyle}>Heating / Cooling</Text>
        <View
          style={{
            zIndex: heatingCoolingOpen ? 1000 : 1,
            position: 'relative',
            elevation: heatingCoolingOpen ? 10 : 0,
          }}>
          <DropDownPicker
            open={heatingCoolingOpen}
            value={filters.heating_Cooling}
            items={heatingCoolingItems}
            setOpen={setHeatingCoolingOpen}
            setValue={val =>
              setFilters(prev => ({...prev, heating_Cooling: val()}))
            }
            setItems={() => {}}
            placeholder="Select option"
            style={[inputStyle, {marginBottom: heatingCoolingOpen ? 120 : 12}]}
            dropDownContainerStyle={{
              ...inputStyle,
              marginBottom: 12,
            }}
          />
        </View>

        {/* Water/Electricity Availability */}
        <Text style={labelStyle}>Water & Electricity</Text>
        <View
          style={{
            zIndex: availabilityOpen ? 1000 : 1,
            position: 'relative',
            elevation: availabilityOpen ? 10 : 0,
          }}>
          <DropDownPicker
            open={availabilityOpen}
            value={filters.water_electricityAvailability}
            items={availabilityItems}
            setOpen={setAvailabilityOpen}
            setValue={val =>
              setFilters(prev => ({
                ...prev,
                water_electricityAvailability: val(),
              }))
            }
            setItems={() => {}}
            placeholder="Select option"
            style={[inputStyle, {marginBottom: availabilityOpen ? 120 : 12}]}
            dropDownContainerStyle={{
              ...inputStyle,
              marginBottom: 12,
            }}
          />
        </View>

        {/* Switch Toggles */}
        {[
          {label: 'Pets Allowed', key: 'petsAllowed'},
          {label: 'Parking', key: 'parking'},
          {label: 'Furnished', key: 'furnished'},
          {label: 'Elevator', key: 'elevator'},
          {label: 'Balcony', key: 'balcony'},
          {label: 'Title Deed / Document', key: 'titleDeed_Document'},
        ].map(({label, key}) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <Text>{label}</Text>
            <Switch
              value={!!filters[key]}
              onValueChange={val => updateField(key, val)}
            />
          </View>
        ))}

        {/* Nearby Landmarks */}
        <Text style={labelStyle}>Nearby Landmarks</Text>
        <TextInput
          value={filters.nearbyLandmarks || ''}
          onChangeText={text => updateField('nearbyLandmarks', text)}
          placeholder="e.g. Near Faisal Mosque"
          style={inputStyle}
        />

        {/* Distance from City Center */}
        <Text style={labelStyle}>Distance from City Center / Transport</Text>
        <TextInput
          value={filters.distancefroCityCenter_transport || ''}
          onChangeText={text =>
            updateField('distancefroCityCenter_transport', text)
          }
          placeholder="e.g. 5km from Metro"
          style={inputStyle}
        />

        {/* Reset Filters Button */}
        <TouchableOpacity
          onPress={resetFilters}
          style={{marginTop: 20, alignSelf: 'center'}}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>Reset Filters</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </View>
  );
};

export default PropertyAdjustFilterSheet;
