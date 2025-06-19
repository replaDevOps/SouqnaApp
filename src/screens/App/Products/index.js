/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';
import MainHeader from '../../../components/Headers/MainHeader';
import {
  BASE_URL_Product,
  fetchProductsBySubCategory,
} from '../../../api/apiServices';
import {mvs} from '../../../util/metrices';
import Regular from '../../../typography/RegularText';
import {HeartSvg} from '../../../assets/svg';
import Bold from '../../../typography/BoldText';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import CarFilters from '../../../components/atoms/CarFilters';
import BrandFilterSheet from '../../../components/Sheets/BrandFilterSheet';
import PriceFilterSheet from '../../../components/Sheets/PriceFilterSheet';
import BuildYearFilterSheet from '../../../components/Sheets/BuildYearFilterSheet';
const BRANDS = [
  'Audi',
  'BAIC',
  'BMW',
  'Changan',
  'Chevrolet',
  'Daewoo',
  'Daihatsu',
  'DFSK',
  'Dongfeng',
  'FAW',
  'Geely',
  'Haval',
  'Hino',
  'Honda',
  'Hyundai',
  'Isuzu',
  'JAC',
  'Kia',
  'Land Rover',
  'Lexus',
  'Master Motors',
  'Mazda',
  'Mercedes-Benz',
  'MG',
  'Mitsubishi',
  'Nissan',
  'Peugeot',
  'Prince',
  'Proton',
  'Range Rover',
  'Renault',
  'Subaru',
  'Suzuki',
  'Tesla',
  'Toyota',
  'United Motors',
  'Volkswagen',
];

const Products = () => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    buildYearMin: '',
    buildYearMax: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState({});
  const {t} = useTranslation();

  const refBrandSheet = useRef(null);
  const refPriceSheet = useRef(null);
  const refPriceInput = useRef(null); // ⬅️ add this
  const refBuildYearSheet = useRef(null);
  const refBuildYearInput = useRef(null);

  const {role, id: userId} = useSelector(state => state.user);
  const favorites = useSelector(state => state.favorites.favorites);
  const [activeSheet, setActiveSheet] = useState(null); // 'price' | 'brand' | 'year' | null
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {id: subCategoryId, name, category} = route.params;
  const getCurrencySymbol = (currency = 'USD') => {
    switch (currency?.toUpperCase?.()) {
      case 'TRY':
        return '₺';
      case 'USD':
        return '$';
      case 'SYP':
        return '£';
      default:
        return '$';
    }
  };
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;
  const MAX_PRICE_HEIGHT = SCREEN_HEIGHT * 0.5;
  const [shouldAutoFocusPrice, setShouldAutoFocusPrice] = useState(false);

  const [brandSearch, setBrandSearch] = useState('');
  const filteredBrands = useMemo(() => {
    return BRANDS.filter(brand =>
      brand.toLowerCase().includes(brandSearch.toLowerCase()),
    );
  }, [brandSearch]);
  useEffect(() => {
    if (products.length > 0) return; // ✅ prevents re-fetch if already fetched

    const fetchData = async () => {
      setLoading(true);
      const response = await fetchProductsBySubCategory(subCategoryId);
      if (response?.data) {
        const parsedProducts = response.data.map(product => {
          try {
            const customFields = JSON.parse(product.custom_fields || '[]');
            const yearField = customFields.find(
              f => f.name === 'yearofManufacture',
            );
            const brandField = customFields.find(f => f.name === 'make_Brand');

            return {
              ...product,
              buildYear: yearField?.value || '',
              brand: brandField?.value || '',
            };
          } catch (e) {
            console.warn('Failed to parse custom fields:', e);
            return product;
          }
        });

        setProducts(parsedProducts);

        // setProducts(response.data);
        console.log('Fetch Products by subcategory:', response.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [subCategoryId]);

  const likedItemes = useMemo(() => {
    const map = {};
    favorites.forEach(item => {
      map[item.id] = true;
    });
    return map;
  }, [favorites]);

  const navigateToProductDetails = productId => {
    navigation.navigate('ProductDetail', {productId});
    console.log('Product ID: ', productId);
  };

  const handleHeartClick = (id, product) => {
    if (likedItems[id]) {
      dispatch(removeFavorite(product));
      setLikedItems(prevState => {
        const updatedState = {...prevState};
        delete updatedState[id];
        return updatedState;
      });
      console.log('Removed from favorites:', product);
    } else {
      dispatch(addFavorite(product));
      setLikedItems(prevState => ({
        ...prevState,
        [id]: true,
      }));
      console.log('Added to favorites:', product);
    }
  };
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (category !== 'Vehicle') return true;

      const price = Number(product.price);
      const min = Number(filters.minPrice || 0);
      const max = Number(filters.maxPrice || Infinity);
      const brandMatch = filters.brand
        ? product.brand?.toLowerCase().startsWith(filters.brand.toLowerCase())
        : true;
      const yearMatch = filters.buildYear
        ? String(product.buildYear)?.startsWith(filters.buildYear)
        : true;

      return price >= min && price <= max && brandMatch && yearMatch;
    });
  }, [filters, products, category]);

  const renderRecommendedItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.recommendedItem}
        onPress={() => navigateToProductDetails(item.id)}>
        <Image
          source={{uri: `${BASE_URL_Product}${item.images?.[0]?.path}`}}
          style={styles.recommendedImage}
        />
        <View style={styles.recommendedTextContainer}>
          <Regular style={styles.recommendedTitle}>{item.name}</Regular>
          <Regular style={styles.recommendedPrice}>
            {getCurrencySymbol(item?.currency)}{' '}
            {Number(item.price).toLocaleString()}
          </Regular>
        </View>
        {role !== 2 && (
          <TouchableOpacity
            onPress={() => handleHeartClick(item.id, item)}
            style={styles.heartIconContainer}>
            <HeartSvg filled={likedItemes[item.id]} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ),
    [handleHeartClick, likedItemes, navigateToProductDetails],
  );

  const closeAllSheets = async callback => {
    Keyboard.dismiss();
    if (refBrandSheet.current) await refBrandSheet.current.close();
    if (refPriceSheet.current) await refPriceSheet.current.close();
    if (refBuildYearSheet.current) await refBuildYearSheet.current.close();

    // Small timeout ensures sheets close before new one opens
    setTimeout(() => {
      callback?.();
    }, 200);
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}} // less dark
      />
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={[styles.container, {position: 'relative'}]}>
        <StatusBar barStyle="dark-content" />
        <MainHeader title={name} showBackIcon />

        {loading ? (
          <View style={styles.noListingsContainer}>
            <ActivityIndicator size="large" style={{marginTop: 20}} />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.noListingsContainer}>
            <Image
              source={require('../../../assets/img/empty.png')}
              style={{width: '90%', resizeMode: 'contain', height: mvs(200)}}
            />
            <Bold>{t('No Listings Right Now')}</Bold>
          </View>
        ) : (
          <>
            {category?.toLowerCase() === 'vehicle' && (
              <View style={{height: 60}}>
                <CarFilters
                  filters={filters}
                  setFilters={setFilters}
                  onOpenBrandSheet={() => {
                    closeAllSheets(() => refBrandSheet.current?.snapToIndex(1));
                    setActiveSheet('brand');
                  }}
                  onOpenPriceSheet={() => {
                    closeAllSheets(() => {
                      refPriceSheet.current?.expand();
                      setActiveSheet('price');
                      setTimeout(() => {
                        refPriceInput.current?.focusMinPrice(); // wait for animation
                      }, 300);
                    });
                  }}
                  onOpenBuildYearSheet={() => {
                    closeAllSheets(() => {
                      refBuildYearSheet.current?.expand();
                      setActiveSheet('year');
                      setTimeout(() => {
                        refBuildYearInput.current?.focusMinYear(); // ✅ focus input after animation
                      }, 300);
                    });
                  }}
                />
              </View>
            )}
            <FlatList
              data={filteredProducts}
              renderItem={renderRecommendedItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.recommendedContainer}
              numColumns={2}
              keyboardShouldPersistTaps="handled" // ✅ Important
            />
            <BottomSheet
              ref={refBrandSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'brand')
                  setActiveSheet(null);
              }}
              index={-1}
              snapPoints={[MAX_SHEET_HEIGHT * 0.5, MAX_SHEET_HEIGHT]}
              enablePanDownToClose
              detached
              keyboardBehavior="none"
              keyboardBlurBehavior="restore"
              backgroundStyle={{backgroundColor: '#fff'}}
              handleStyle={{backgroundColor: '#fff'}}
              backdropComponent={renderBackdrop} // ✅ Add this
              style={{
                marginHorizontal: 4,
                borderRadius: mvs(30),
                overflow: 'hidden',
              }}>
              <BrandFilterSheet
                refBrandSheet={refBrandSheet}
                filteredBrands={filteredBrands}
                brandSearch={brandSearch}
                setBrandSearch={setBrandSearch}
                setFilters={setFilters}
              />
            </BottomSheet>

            <BottomSheet
              ref={refPriceSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'price')
                  setActiveSheet(null);
                Keyboard.dismiss();
              }}
              index={-1}
              snapPoints={[mvs(150), MAX_PRICE_HEIGHT]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              <PriceFilterSheet
                ref={refPriceInput}
                filters={filters}
                setFilters={setFilters}
              />
            </BottomSheet>

            <BottomSheet
              ref={refBuildYearSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'year')
                  setActiveSheet(null);
                Keyboard.dismiss();
              }}
              index={-1}
              snapPoints={[mvs(150), MAX_PRICE_HEIGHT]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              <BuildYearFilterSheet
                filters={filters}
                setFilters={setFilters}
                ref={refBuildYearInput}
              />
            </BottomSheet>
          </>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Products;
