import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

const options = ['Automatic', 'Manual'];

const TransmissionFilterSheet = ({filters, setFilters, closeSheet}) => {
  const {t} = useTranslation();
  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
        {t('Select Transmission')}
      </Text>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => {
            setFilters(prev => ({...prev, transmission: t(option)}));
            closeSheet();
          }}
          style={{
            padding: 12,
            backgroundColor:
              filters.transmission === option ? '#ddd' : '#f5f5f5',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Text>{t(option)}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};

export default TransmissionFilterSheet;
