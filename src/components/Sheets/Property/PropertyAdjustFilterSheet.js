/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  sectionTitleStyle,
  labelStyle,
  inputStyle,
} from '../../../util/Filtering/filterStyles';
import {colors} from '../../../util/color';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import CustomText from '../../CustomText';

const PropertyAdjustFilterSheet = ({filters, setFilters, closeSheet}) => {
  const updateField = (key, value) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const {i18n} = useTranslation();

  const resetFilters = () => {
    setFilters({});
  };

  const [heatingCoolingOpen, setHeatingCoolingOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [purposeOpen, setPurposeOpen] = useState(false);

  const isArabic = i18n.language === 'ar';

  const purposeItems = isArabic
    ? [
        {label: 'للبيع', value: 'للبيع'},
        {label: 'للإيجار', value: 'للإيجار'},
        {label: 'أخرى', value: 'أخرى'},
      ]
    : [
        {label: 'For Sale', value: 'For Sale'},
        {label: 'For Rent', value: 'For Rent'},
        {label: 'Other', value: 'Other'},
      ];

  const heatingCoolingItems = isArabic
    ? [
        {label: 'مثبت', value: 'مثبت'},
        {label: 'غير مثبت', value: 'غير مثبت'},
      ]
    : [
        {label: 'Installed', value: 'Installed'},
        {label: 'Not Installed', value: 'Not Installed'},
      ];

  const availabilityItems = isArabic
    ? [
        {label: 'متوفر', value: 'متوفر'},
        {label: 'غير متوفر', value: 'غير متوفر'},
      ]
    : [
        {label: 'Available', value: 'Available'},
        {label: 'Not Available', value: 'Not Available'},
      ];

  const booleanOptions = [
    {label: isArabic ? 'نعم' : 'Yes', value: true},
    {label: isArabic ? 'لا' : 'No', value: false},
  ];

  // Define state for each dropdown open status
  const [dropdownStates, setDropdownStates] = useState({
    petsAllowed: false,
    parking: false,
    furnished: false,
    elevator: false,
    balcony: false,
    ownership_document: false,
    purpose: false,
  });

  return (
    <View style={{flex: 1, zIndex: 0}}>
      <BottomSheetScrollView
        contentContainerStyle={{padding: 20, paddingBottom: 60}}>
        {/* --- BASIC FILTERS --- */}
        <CustomText style={sectionTitleStyle}>{t('Basic Filters')}</CustomText>

        {/* Property Type */}
        <CustomText style={labelStyle}>{t('Property Type')}</CustomText>
        <TextInput
          placeholder="e.g. Villa, Apartment"
          value={filters.propertyType || ''}
          onChangeText={text => updateField('propertyType', text)}
          style={inputStyle}
        />

        <CustomText style={labelStyle}>{t('Purpose')}</CustomText>
        <View style={{zIndex: purposeOpen ? 1000 : 1}}>
          <DropDownPicker
            open={purposeOpen}
            value={filters.purpose}
            items={purposeItems}
            setOpen={setPurposeOpen}
            setValue={val => updateField('purpose', val())}
            setItems={() => {}}
            placeholder={t('Select Purpose')}
            style={[inputStyle, {marginBottom: purposeOpen ? 120 : 12}]}
            dropDownContainerStyle={{...inputStyle, marginBottom: 12}}
          />
        </View>

        {/* Size */}
        <CustomText style={labelStyle}>{t('size')}</CustomText>
        <TextInput
          placeholder={t('e.g. 1 Kanal, 10 Marla')}
          value={filters.size || ''}
          onChangeText={text => updateField('size', text)}
          style={inputStyle}
        />

        {/* Area Range */}
        <CustomText style={labelStyle}>{t('areaRange')}</CustomText>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TextInput
            placeholder={t('Min')}
            keyboardType="numeric"
            value={filters.minArea}
            onChangeText={text => updateField('minArea', text)}
            style={[inputStyle, {flex: 1}]}
          />
          <TextInput
            placeholder={t('Max')}
            keyboardType="numeric"
            value={filters.maxArea}
            onChangeText={text => updateField('maxArea', text)}
            style={[inputStyle, {flex: 1}]}
          />
        </View>

        {/* Rooms */}
        <CustomText style={labelStyle}>{t('Rooms')}</CustomText>
        <TextInput
          placeholder={t('e.g. 4')}
          keyboardType="numeric"
          value={filters.rooms || ''}
          onChangeText={text => updateField('rooms', text)}
          style={inputStyle}
        />

        {/* Bathrooms */}
        <CustomText style={labelStyle}>{t('Bathrooms')}</CustomText>
        <TextInput
          placeholder={t('e.g. 2')}
          keyboardType="numeric"
          value={filters.bathrooms || ''}
          onChangeText={text => updateField('bathrooms', text)}
          style={inputStyle}
        />

        {/* --- ADDITIONAL FILTERS --- */}
        <CustomText style={sectionTitleStyle}>
          {t('Additional Filters')}
        </CustomText>

        {/* Floor Number */}
        <CustomText style={labelStyle}>{t('Floor Number')}</CustomText>
        <TextInput
          placeholder="e.g. 1"
          keyboardType="numeric"
          value={filters.floorNumber || ''}
          onChangeText={text => updateField('floorNumber', text)}
          style={inputStyle}
        />

        {/* Total Floors */}
        <CustomText style={labelStyle}>{t('Total Floors')}</CustomText>
        <TextInput
          placeholder="e.g. 5"
          keyboardType="numeric"
          value={filters.totalFloorsInBuilding || ''}
          onChangeText={text => updateField('totalFloorsInBuilding', text)}
          style={inputStyle}
        />

        {/* Heating / Cooling */}
        <CustomText style={labelStyle}>{t('Heating / Cooling')}</CustomText>
        <View style={{zIndex: heatingCoolingOpen ? 1000 : 1}}>
          <DropDownPicker
            open={heatingCoolingOpen}
            value={filters.heating_Cooling}
            items={heatingCoolingItems}
            setOpen={setHeatingCoolingOpen}
            setValue={val => updateField('heating_Cooling', val())}
            setItems={() => {}}
            placeholder={t('Select Option')}
            style={[inputStyle, {marginBottom: heatingCoolingOpen ? 120 : 12}]}
            dropDownContainerStyle={{...inputStyle, marginBottom: 12}}
          />
        </View>

        {/* Water & Electricity Availability */}
        <CustomText style={labelStyle}>{t('Water & Electricity')}</CustomText>
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
            placeholder={t('Select Option')}
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
            <CustomText>{label}</CustomText>
            <Switch
              value={filters[key]}
              onValueChange={val => updateField(key, val)}
            />
          </View>
        ))} */}

        {[
          {label: t('Pets Allowed'), key: 'pets_allowed'},
          {label: t('Parking'), key: 'parking'},
          {label: t('Furnished'), key: 'furnished'},
          {label: t('Elevator'), key: 'elevator'},
          {label: t('Balcony / Terrace'), key: 'balcony_terrace'},
          {label: t('Title Deed'), key: 'ownership_document'},
        ].map(({label, key}) => (
          <View
            key={key}
            style={{zIndex: dropdownStates[key] ? 1000 : 1, marginBottom: 12}}>
            <CustomText style={labelStyle}>{label}</CustomText>
            <DropDownPicker
              open={dropdownStates[key]}
              value={filters[key]}
              items={booleanOptions}
              setOpen={open =>
                setDropdownStates(prev => ({...prev, [key]: open}))
              }
              setValue={val => updateField(key, val())}
              setItems={() => {}}
              placeholder={t('Select Option')}
              style={inputStyle}
              dropDownContainerStyle={inputStyle}
            />
          </View>
        ))}

        {/* Nearby Landmarks */}
        <CustomText style={labelStyle}>{t('Nearby Landmarks')}</CustomText>
        <TextInput
          placeholder="e.g. Near Faisal Mosque"
          value={filters.nearbyLandmarks || ''}
          onChangeText={text => updateField('nearbyLandmarks', text)}
          style={inputStyle}
        />

        {/* Distance from City Center */}
        <CustomText style={labelStyle}>{t('Transport')}</CustomText>
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
          <CustomText style={{color: 'red', fontWeight: 'bold'}}>
            Reset Filters
          </CustomText>
        </TouchableOpacity>

        {/* --- DONE BUTTON --- */}
        <View style={{padding: 20}}>
          <TouchableOpacity
            onPress={() => {
              closeSheet?.();
            }}
            style={{
              backgroundColor: colors.lightgreen,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <CustomText style={{color: '#fff', fontWeight: 'bold'}}>
              {t('Done')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </View>
  );
};

export default PropertyAdjustFilterSheet;
