import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {TextInput} from 'react-native';
import {BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

const BuildYearFilterSheet = ({filters, setFilters}, ref) => {
  const minYearRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusMinYear: () => {
      minYearRef.current?.focus();
    },
  }));
  const {t} = useTranslation();

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 60,
        flexDirection: 'row',
        gap: 10,
      }}>
      <TextInput
        ref={minYearRef}
        style={{
          flex: 1,
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}
        placeholder={t('Min Year')}
        keyboardType="numeric"
        value={filters.buildYearMin}
        onChangeText={text =>
          setFilters(prev => ({...prev, buildYearMin: text}))
        }
      />
      <TextInput
        style={{
          flex: 1,
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}
        placeholder={t('Max Year')}
        keyboardType="numeric"
        value={filters.buildYearMax}
        onChangeText={text =>
          setFilters(prev => ({...prev, buildYearMax: text}))
        }
      />
    </BottomSheetScrollView>
  );
};

export default forwardRef(BuildYearFilterSheet);
