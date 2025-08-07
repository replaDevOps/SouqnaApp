/* eslint-disable react-native/no-inline-styles */
import {Text, View, TextInput, Pressable, Keyboard} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {mvs} from '../../util/metrices';
import {TickSVG} from '../../assets/svg';
import {t} from 'i18next';
import {colors} from '../../util/color';

const BrandFilterSheet = ({
  refBrandSheet,
  filteredBrands,
  brandSearch,
  setBrandSearch,
  setFilters,
  filters,
}) => {
  // const toggleBrand = (brand) => {
  //   setFilters(prev => {
  //     const currentBrands = prev.brand || [];
  //     const isSelected = currentBrands.includes(brand);
  //     return {
  //       ...prev,
  //       brand: isSelected
  //         ? currentBrands.filter(b => b !== brand)
  //         : [...currentBrands, brand],
  //     };
  //   });
  // };
  const toggleBrand = brand => {
    console.log('brand', brand);
    setFilters(prev => {
      const currentBrands = prev.make_brand || [];
      const isSelected = currentBrands.includes(brand);
      return {
        ...prev,
        make_brand: isSelected
          ? currentBrands.filter(b => b !== brand)
          : [...currentBrands, brand],
      };
    });

    setBrandSearch('');
    Keyboard.dismiss();
    refBrandSheet.current?.snapToIndex(1);
  };

  console.log('filteredBrands', filteredBrands);

  return (
    <BottomSheetFlatList
      data={filteredBrands}
      keyExtractor={item => item}
      renderItem={({item: brand}) => {
        const isSelected =
          Array.isArray(filters?.make_brand) &&
          filters.make_brand.includes(t(brand));
        return (
          <Pressable
            onPress={() => toggleBrand(t(brand))}
            style={{
              paddingVertical: 12,
              borderBottomColor: '#eee',
              borderBottomWidth: 1,
              paddingHorizontal: mvs(15),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16}}>{t(brand)}</Text>
            {isSelected && <TickSVG width={20} height={20} />}
          </Pressable>
        );
      }}
      ListHeaderComponent={
        <>
          <View style={{alignItems: 'center', paddingVertical: 10}}>
            <Text style={{fontSize: 18, fontWeight: '600'}}>{t('brand')}</Text>
          </View>
          <View style={{paddingHorizontal: mvs(15), paddingBottom: 10}}>
            <TextInput
              placeholder={t('Search brands...')}
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
              setFilters(prev => ({...prev, make_brand: []}));
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
            <Text style={{fontSize: 16, color: 'red'}}>
              {t('Clear Brand Filter')}
            </Text>
          </Pressable>
        </>
      }
      ListFooterComponent={
        <View style={{padding: mvs(20)}}>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              refBrandSheet.current?.close();
            }}
            style={{
              backgroundColor: colors.lightgreen,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>
              {t('done')}
            </Text>
          </Pressable>
        </View>
      }
      contentContainerStyle={{paddingBottom: 30}}
      keyboardShouldPersistTaps="handled"
    />
  );
};

export default BrandFilterSheet;
