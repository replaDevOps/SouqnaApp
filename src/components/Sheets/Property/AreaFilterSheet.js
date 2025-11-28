import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {TextInput} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

const AreaFilterSheet = ({filters, setFilters}, ref) => {
  const minAreaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusMinArea: () => {
      minAreaRef.current?.focus();
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
        ref={minAreaRef}
        placeholder={t('Min Size (sqft)')}
        keyboardType="numeric"
        value={filters.minArea}
        onChangeText={text => setFilters(prev => ({...prev, minArea: text}))}
      />
      <TextInput
        style={{
          flex: 1,
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}
        placeholder={t('Max Size (sqft)')}
        keyboardType="numeric"
        value={filters.maxArea}
        onChangeText={text => setFilters(prev => ({...prev, maxArea: text}))}
      />
    </BottomSheetScrollView>
  );
};

export default forwardRef(AreaFilterSheet);
