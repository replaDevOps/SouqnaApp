import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {TextInput} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

const PriceFilterSheet = ({filters, setFilters}, ref) => {
  const minPriceRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusMinPrice: () => {
      minPriceRef.current?.focus();
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
        style={{
          flex: 1,
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}
        ref={minPriceRef}
        placeholder={t('Min Price')}
        keyboardType="numeric"
        value={filters.minPrice}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          setFilters(prev => ({...prev, minPrice: numericText}));
        }}
      />
      <TextInput
        style={{
          flex: 1,
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}
        placeholder={t('Max Price')}
        keyboardType="numeric"
        value={filters.maxPrice}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          setFilters(prev => ({...prev, maxPrice: numericText}));
        }}
      />
    </BottomSheetScrollView>
  );
};

export default forwardRef(PriceFilterSheet);
