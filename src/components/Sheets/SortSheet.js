/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import CustomText from '../CustomText';

const options = [
  'Newest First',
  'Oldest First',
  'Price: Low to High',
  'Price: High to Low',
];

const SortSheet = ({sortOption, setSortOption, closeSheet}) => {
  const {t} = useTranslation();
  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}>
      <CustomText style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
        {t('Sort By')}
      </CustomText>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => {
            setSortOption(t(option));
            closeSheet();
          }}
          style={{
            padding: 12,
            backgroundColor: sortOption === option ? '#ddd' : '#f5f5f5',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <CustomText>{t(option)}</CustomText>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};

export default SortSheet;
