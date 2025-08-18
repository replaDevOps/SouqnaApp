/* eslint-disable react-native/no-inline-styles */
import {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  sectionTitleStyle,
  inputStyle,
  labelStyle,
  resetButtonStyle,
} from '../../util/Filtering/filterStyles';
import {colors} from '../../util/color';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import CustomText from '../CustomText';
const AdjustFilterSheet = ({
  filters,
  setFilters,
  onOpenBrandSheet,
  onOpenPriceSheet,
  onOpenTransmissionSheet,
  onOpenBuildYearSheet,
  onApplyFilters,
  closeSheet,
}) => {
  useEffect(() => {
    if (fuelOpen) {
      setConditionOpen(false);
    }
  }, [fuelOpen]);

  useEffect(() => {
    if (conditionOpen) {
      setFuelOpen(false);
    }
  }, [conditionOpen]);

  const {i18n} = useTranslation();

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

  const isArabic = i18n.language === 'ar';

  const [fuelOpen, setFuelOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  const [fuelItems, setFuelItems] = useState(
    isArabic
      ? [
          {label: 'بنزين', value: 'بنزين'},
          {label: 'ديزل', value: 'ديزل'},
          {label: 'هجين', value: 'هجين'},
          {label: 'كهرباء', value: 'كهرباء'},
        ]
      : [
          {label: 'Petrol', value: 'Petrol'},
          {label: 'Diesel', value: 'Diesel'},
          {label: 'Hybrid', value: 'Hybrid'},
          {label: 'Electric', value: 'Electric'},
        ],
  );

  const [conditionItems, setConditionItems] = useState([
    {label: 'Used', value: 'Used'},
    {label: 'New', value: 'New'},
  ]);

  return (
    <View style={{flex: 1, zIndex: 0}}>
      <BottomSheetScrollView
        contentContainerStyle={{padding: 20, paddingBottom: 60}}>
        {/* --- BASIC FILTERS --- */}
        <CustomText style={sectionTitleStyle}>{t('Basic Filters')}</CustomText>

        {/* Brand */}
        <CustomText style={labelStyle}>
          {t('Brand / Make') || 'Brand / Make'}
        </CustomText>
        <TouchableOpacity
          onPress={() => {
            onOpenBrandSheet?.(); // this should be passed from parent
          }}
          style={[inputStyle, {justifyContent: 'center'}]}>
          <CustomText>{filters.brand || t('Select brand')}</CustomText>
        </TouchableOpacity>

        {/* Model */}
        <CustomText style={labelStyle}>{t('Model')}</CustomText>
        <TextInput
          placeholder={t('Enter model')}
          value={filters.model}
          onChangeText={text => setFilters(prev => ({...prev, model: text}))}
          style={inputStyle}
        />

        {/* Price Range */}
        <CustomText style={labelStyle}>{t('priceRange')}</CustomText>
        <TouchableOpacity
          onPress={onOpenPriceSheet}
          style={[inputStyle, {justifyContent: 'center'}]}>
          <CustomText>
            {filters.minPrice || filters.maxPrice
              ? `${
                  filters.minPrice ? `${t('From')} ${filters.minPrice}` : ''
                } ${
                  filters.maxPrice ? `${t('Up to')}${filters.maxPrice}` : ''
                }`.trim()
              : t('Select price range')}
          </CustomText>
        </TouchableOpacity>

        {/* Year Range */}
        <CustomText style={labelStyle}>{t('yearRange')}</CustomText>
        <TouchableOpacity
          onPress={onOpenBuildYearSheet}
          style={[inputStyle, {justifyContent: 'center'}]}>
          <CustomText>
            {filters.buildYearMin || filters.buildYearMax
              ? `${
                  filters.buildYearMin
                    ? `${t('From')} ${filters.buildYearMin}`
                    : ''
                } ${
                  filters.buildYearMax
                    ? `${t('Up to')}${filters.buildYearMax}`
                    : ''
                }`.trim()
              : t('Select year range')}
          </CustomText>
        </TouchableOpacity>

        {/* Mileage Range */}
        <CustomText style={labelStyle}>{t('mileageRange')}</CustomText>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TextInput
            placeholder={t('Min (km)')}
            keyboardType="numeric"
            value={filters.minMileage}
            onChangeText={text =>
              setFilters(prev => ({...prev, minMileage: text}))
            }
            style={[inputStyle, {flex: 1}]}
          />
          <TextInput
            placeholder={t('Max (km)')}
            keyboardType="numeric"
            value={filters.maxMileage}
            onChangeText={text =>
              setFilters(prev => ({...prev, maxMileage: text}))
            }
            style={[inputStyle, {flex: 1}]}
          />
        </View>

        {/* Fuel Type */}
        <CustomText style={labelStyle}> {t('fuelType')} </CustomText>
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
            setValue={val => {
              setFilters(prev => ({...prev, fuelType: val()}));
            }}
            setItems={setFuelItems}
            placeholder={t('Select fuel type')}
            style={[inputStyle, {marginBottom: fuelOpen ? 120 : 12}]}
            dropDownContainerStyle={{
              ...inputStyle,
              marginBottom: 12,
            }}
          />
        </View>

        {/* Transmission */}
        <CustomText style={labelStyle}> {t('transmissionType')} </CustomText>
        <TouchableOpacity
          onPress={onOpenTransmissionSheet}
          style={[inputStyle, {justifyContent: 'center'}]}>
          <CustomText>
            {filters.transmission || t('Select transmission')}
          </CustomText>
        </TouchableOpacity>

        {/* Location (from registrationCity) */}
        {/* <CustomText style={labelStyle}>Location</CustomText>
        <TextInput
          placeholder="Enter location"
          value={filters.location}
          onChangeText={text => setFilters(prev => ({...prev, location: text}))}
          style={inputStyle}
        /> */}

        {/* <CustomText style={labelStyle}>Location</CustomText> */}
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
        <CustomText style={sectionTitleStyle}>
          {t('Additional Filters')}
        </CustomText>

        {/* Color */}
        {/* <CustomText style={labelStyle}>Color</CustomText>
        <TextInput
          placeholder="Enter color"
          value={filters.color}
          onChangeText={text => setFilters(prev => ({...prev, color: text}))}
          style={inputStyle}
        /> */}

        {/* Power */}
        <CustomText style={labelStyle}>
          {}
          {t('power') || 'Power (HP/kW)'}
        </CustomText>
        <TextInput
          placeholder={t('Enter power')}
          keyboardType="numeric"
          value={filters.power}
          onChangeText={text => setFilters(prev => ({...prev, power: text}))}
          style={inputStyle}
        />

        {/* Inspection Validity */}
        <CustomText style={labelStyle}>
          {t('inspectionValidity') || 'Inspection Validity'}
        </CustomText>
        <TextInput
          placeholder={t('Valid till (e.g. 2026)')}
          value={filters.inspection}
          onChangeText={text =>
            setFilters(prev => ({...prev, inspection: text}))
          }
          style={inputStyle}
        />

        {/* --- RESET FILTERS BUTTON --- */}
        <TouchableOpacity onPress={resetFilters} style={resetButtonStyle}>
          <CustomText style={{color: 'red', fontWeight: 'bold'}}>
            {t('resetFilters')}
          </CustomText>
        </TouchableOpacity>

        {/* --- DONE BUTTON --- */}
        <View style={{padding: 20}}>
          <TouchableOpacity
            onPress={() => {
              onApplyFilters;
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

export default AdjustFilterSheet;
