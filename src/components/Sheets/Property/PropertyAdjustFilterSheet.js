/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  sectionTitleStyle,
  labelStyle,
  inputStyle,
} from '../../../util/Filtering/filterStyles';


const PropertyAdjustFilterSheet = ({filters, setFilters}) => {
  const updateField = (key, value) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const [heatingCoolingOpen, setHeatingCoolingOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [purposeOpen, setPurposeOpen] = useState(false);

const purposeItems = [
  { label: 'For Sale', value: 'For Sale' },
  { label: 'For Rent', value: 'For Rent' },
  { label: 'Other', value: 'Other' },
];


  const heatingCoolingItems = [
    {label: 'Installed', value: 'Installed'},
    {label: 'Not Installed', value: 'Not Installed'},
  ];

  const availabilityItems = [
    {label: 'Available', value: 'Available'},
    {label: 'Not Available', value: 'Not Available'},
  ];
  const booleanOptions = [
  {label: 'Yes', value: true},
  {label: 'No', value: false},
];

// Define state for each dropdown open status
const [dropdownStates, setDropdownStates] = useState({
  petsAllowed: false,
  parking: false,
  furnished: false,
  elevator: false,
  balcony: false,
  titleDeed_Document: false,
  purpose: false
});


  return (
    <View style={{flex: 1, zIndex: 0}}>
      <BottomSheetScrollView
        contentContainerStyle={{padding: 20, paddingBottom: 60}}>
        {/* --- BASIC FILTERS --- */}
        <Text style={sectionTitleStyle}>Basic Filters</Text>

        {/* Property Type */}
        <Text style={labelStyle}>Property Type</Text>
        <TextInput
          placeholder="e.g. Villa, Apartment"
          value={filters.propertyType || ''}
          onChangeText={text => updateField('propertyType', text)}
          style={inputStyle}
        />

<Text style={labelStyle}>Purpose</Text>
<View style={{ zIndex: purposeOpen ? 1000 : 1 }}>
  <DropDownPicker
    open={purposeOpen}
    value={filters.purpose}
    items={purposeItems}
    setOpen={setPurposeOpen}
    setValue={val => updateField('purpose', val())}
    setItems={() => {}}
    placeholder="Select Purpose"
    style={[inputStyle, { marginBottom: purposeOpen ? 120 : 12 }]}
    dropDownContainerStyle={{ ...inputStyle, marginBottom: 12 }}
  />
</View>


        {/* Size */}
        <Text style={labelStyle}>Size</Text>
        <TextInput
          placeholder="e.g. 1 Kanal, 10 Marla"
          value={filters.size || ''}
          onChangeText={text => updateField('size', text)}
          style={inputStyle}
        />

        {/* Area Range */}
        <Text style={labelStyle}>Area Range (sqft)</Text>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TextInput
            placeholder="Min"
            keyboardType="numeric"
            value={filters.minArea}
            onChangeText={text => updateField('minArea', text)}
            style={[inputStyle, {flex: 1}]}
          />
          <TextInput
            placeholder="Max"
            keyboardType="numeric"
            value={filters.maxArea}
            onChangeText={text => updateField('maxArea', text)}
            style={[inputStyle, {flex: 1}]}
          />
        </View>

        {/* Rooms */}
        <Text style={labelStyle}>Rooms</Text>
        <TextInput
          placeholder="e.g. 4"
          keyboardType="numeric"
          value={filters.rooms || ''}
          onChangeText={text => updateField('rooms', text)}
          style={inputStyle}
        />

        {/* Bathrooms */}
        <Text style={labelStyle}>Bathrooms</Text>
        <TextInput
          placeholder="e.g. 2"
          keyboardType="numeric"
          value={filters.bathrooms || ''}
          onChangeText={text => updateField('bathrooms', text)}
          style={inputStyle}
        />

        {/* --- ADDITIONAL FILTERS --- */}
        <Text style={sectionTitleStyle}>Additional Filters</Text>

        {/* Floor Number */}
        <Text style={labelStyle}>Floor Number</Text>
        <TextInput
          placeholder="e.g. 1"
          keyboardType="numeric"
          value={filters.floorNumber || ''}
          onChangeText={text => updateField('floorNumber', text)}
          style={inputStyle}
        />

        {/* Total Floors */}
        <Text style={labelStyle}>Total Floors in Building</Text>
        <TextInput
          placeholder="e.g. 5"
          keyboardType="numeric"
          value={filters.totalFloorsInBuilding || ''}
          onChangeText={text => updateField('totalFloorsInBuilding', text)}
          style={inputStyle}
        />

        {/* Heating / Cooling */}
        <Text style={labelStyle}>Heating / Cooling</Text>
        <View style={{zIndex: heatingCoolingOpen ? 1000 : 1}}>
          <DropDownPicker
            open={heatingCoolingOpen}
            value={filters.heating_Cooling}
            items={heatingCoolingItems}
            setOpen={setHeatingCoolingOpen}
            setValue={val => updateField('heating_Cooling', val())}
            setItems={() => {}}
            placeholder="Select option"
            style={[inputStyle, {marginBottom: heatingCoolingOpen ? 120 : 12}]}
            dropDownContainerStyle={{...inputStyle, marginBottom: 12}}
          />
        </View>

        {/* Water & Electricity Availability */}
        <Text style={labelStyle}>Water & Electricity</Text>
        <View style={{zIndex: availabilityOpen ? 999 : 1}}>
          <DropDownPicker
            open={availabilityOpen}
            value={filters.water_electricityAvailability}
            items={availabilityItems}
            setOpen={setAvailabilityOpen}
            setValue={val =>
              updateField('water_electricityAvailability', val())
            }
            setItems={() => {}}
            placeholder="Select option"
            style={[inputStyle, {marginBottom: availabilityOpen ? 120 : 12}]}
            dropDownContainerStyle={{...inputStyle, marginBottom: 12}}
          />
        </View>

        {/* Switches */}
        {/* {[
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
              value={filters[key]}
              onValueChange={val => updateField(key, val)}
            />
          </View>
        ))} */}

        {[
  {label: 'Pets Allowed', key: 'petsAllowed'},
  {label: 'Parking', key: 'parking'},
  {label: 'Furnished', key: 'furnished'},
  {label: 'Elevator', key: 'elevator'},
  {label: 'Balcony', key: 'balcony'},
  {label: 'Title Deed / Document', key: 'titleDeed_Document'},
].map(({label, key}) => (
  <View key={key} style={{zIndex: dropdownStates[key] ? 1000 : 1, marginBottom: 12}}>
    <Text style={labelStyle}>{label}</Text>
    <DropDownPicker
      open={dropdownStates[key]}
      value={filters[key]}
      items={booleanOptions}
      setOpen={open => setDropdownStates(prev => ({...prev, [key]: open}))}
      setValue={val => updateField(key, val())}
      setItems={() => {}}
      placeholder="Select option"
      style={inputStyle}
      dropDownContainerStyle={inputStyle}
    />
  </View>
))}


        {/* Nearby Landmarks */}
        <Text style={labelStyle}>Nearby Landmarks</Text>
        <TextInput
          placeholder="e.g. Near Faisal Mosque"
          value={filters.nearbyLandmarks || ''}
          onChangeText={text => updateField('nearbyLandmarks', text)}
          style={inputStyle}
        />

        {/* Distance from City Center */}
        <Text style={labelStyle}>Distance from City Center / Transport</Text>
        <TextInput
          placeholder="e.g. 5km from Metro"
          value={filters.distancefroCityCenter_transport || ''}
          onChangeText={text =>
            updateField('distancefroCityCenter_transport', text)
          }
          style={inputStyle}
        />

        {/* Reset Button */}
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
