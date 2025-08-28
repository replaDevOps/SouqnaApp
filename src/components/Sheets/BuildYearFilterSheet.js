import {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

const BuildYearFilterSheet = ({filters, setFilters}, ref) => {
  const minYearRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusMinYear: () => {
      // Open the min year dropdown
      minYearRef.current?.open();
    },
  }));

  const {t} = useTranslation();

  // Generate year options (from current year back to 1900)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push({label: year.toString(), value: year.toString()});
  }

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 60,
        flexDirection: 'row',
        gap: 10,
      }}>
      <View style={{flex: 1}}>
        <Text style={{marginBottom: 5, fontSize: 14, color: '#666'}}>
          {t('Min Year')}
        </Text>
        <Dropdown
          ref={minYearRef}
          mode="default" // Ensures inline dropdown, not fullscreen modal
          style={{
            height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            backgroundColor: '#fff',
          }}
          placeholderStyle={{
            fontSize: 16,
            color: '#999',
          }}
          selectedTextStyle={{
            fontSize: 16,
            color: '#000',
          }}
          data={years}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={t('Select Min Year')}
          value={filters.buildYearMin || null}
          onChange={item => {
            setFilters(prev => ({...prev, buildYearMin: item.value}));
          }}
          dropdownPosition="auto"
        />
      </View>

      <View style={{flex: 1}}>
        <Text style={{marginBottom: 5, fontSize: 14, color: '#666'}}>
          {t('Max Year')}
        </Text>
        <Dropdown
          mode="default" // Ensures inline dropdown, not fullscreen modal
          style={{
            height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            backgroundColor: '#fff',
          }}
          placeholderStyle={{
            fontSize: 16,
            color: '#999',
          }}
          selectedTextStyle={{
            fontSize: 16,
            color: '#000',
          }}
          data={years}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={t('Select Max Year')}
          value={filters.buildYearMax || null}
          onChange={item => {
            setFilters(prev => ({...prev, buildYearMax: item.value}));
          }}
          dropdownPosition="auto"
        />
      </View>
    </BottomSheetScrollView>
  );
};

export default forwardRef(BuildYearFilterSheet);
