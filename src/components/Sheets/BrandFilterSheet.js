import React from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {mvs} from '../../util/metrices';

const BrandFilterSheet = ({
  refBrandSheet,
  filteredBrands,
  brandSearch,
  setBrandSearch,
  setFilters,
}) => {
  return (
    <BottomSheetFlatList
      data={filteredBrands}
      keyExtractor={item => item}
      renderItem={({item: brand}) => (
        <Pressable
          onPress={() => {
            setFilters(prev => ({...prev, brand}));
            Keyboard.dismiss();
            refBrandSheet.current?.close();
          }}
          style={{
            paddingVertical: 12,
            borderBottomColor: '#eee',
            borderBottomWidth: 1,
            paddingHorizontal: mvs(15),
          }}>
          <Text style={{fontSize: 16}}>{brand}</Text>
        </Pressable>
      )}
      ListHeaderComponent={
        <>
          <View style={{alignItems: 'center', paddingVertical: 10}}>
            <Text style={{fontSize: 18, fontWeight: '600'}}>Brand</Text>
          </View>
          <View style={{paddingHorizontal: mvs(15), paddingBottom: 10}}>
            <TextInput
              placeholder="Search brands..."
              value={brandSearch}
              onChangeText={text => {
                setBrandSearch(text);
                refBrandSheet.current?.snapToIndex(1);
              }}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 12,
                fontSize: 16,
              }}
            />
          </View>
          <Pressable
            onPress={() => {
              setFilters(prev => ({...prev, brand: ''}));
              Keyboard.dismiss();
              refBrandSheet.current?.close();
            }}
            style={{
              paddingVertical: 12,
              borderBottomColor: '#eee',
              borderBottomWidth: 1,
              backgroundColor: '#fff',
              paddingHorizontal: mvs(15),
            }}>
            <Text style={{fontSize: 16, color: 'red'}}>Clear Brand Filter</Text>
          </Pressable>
        </>
      }
      contentContainerStyle={{paddingBottom: 30}}
      keyboardShouldPersistTaps="handled"
    />
  );
};

export default BrandFilterSheet;
