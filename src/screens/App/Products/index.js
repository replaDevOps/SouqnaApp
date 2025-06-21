/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
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
  Text,
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
import TransmissionFilterSheet from '../../../components/Sheets/TransmissionFilterSheet';
import AdjustFilterSheet from '../../../components/Sheets/AdjustFilterSheet';
import PropertyFilters from '../../../components/atoms/PropertyFilters';
import AreaFilterSheet from '../../../components/Sheets/Property/AreaFilterSheet';
import PropertyTypeFilterSheet from '../../../components/Sheets/Property/PropertyTypeFilterSheet';
import PropertyAdjustFilterSheet from '../../../components/Sheets/Property/PropertyAdjustFilterSheet';
import { filterPropertyProducts, filterVehicleProducts } from '../../../util/Filtering/filterProducts';
import BottomSheetContainer from '../../../components/Sheets/BottomSheetContainer';
import { getCurrencySymbol } from '../../../util/Filtering/helpers';
import { BRANDS } from '../../../util/Filtering/constants';

const Products = () => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    buildYearMin: '',
    buildYearMax: '',
    transmission: '',
    fuelType: '',
    model: '',
    mileage: '',
    power: '',
    condition: '',
    inspection: '',
    // accidentFree: false,
    color: '',
    minMileage: '',
    maxMileage: '',
    location: '',
    radius: '',

    //Property Filters
    propertyType: '',
    minArea: '',
    maxArea: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState({});
  const {t} = useTranslation();

  const refBrandSheet = useRef(null);
  const refPriceSheet = useRef(null);
  const refPriceInput = useRef(null);
  const refBuildYearSheet = useRef(null);
  const refBuildYearInput = useRef(null);
  const refTransmissionSheet = useRef(null);
  const refAdjustSheet = useRef(null);

  const refPropertyTypeSheet = useRef(null);
  const refAreaSheet = useRef(null);
  const refAreaInput = useRef(null);

  const {role, id: userId} = useSelector(state => state.user);
  const favorites = useSelector(state => state.favorites.favorites);
  const [activeSheet, setActiveSheet] = useState(null); // 'price' | 'brand' | 'year' | null
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {id: subCategoryId, name, category} = route.params;
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;
  const MAX_PRICE_HEIGHT = SCREEN_HEIGHT * 0.5;

  const [brandSearch, setBrandSearch] = useState('');
  const filteredBrands = useMemo(() => {
    return BRANDS.filter(brand =>
      brand.toLowerCase().includes(brandSearch.toLowerCase()),
    );
  }, [brandSearch]);
  useEffect(() => {
    if (products.length > 0) {return;} // ✅ prevents re-fetch if already fetched

    const fetchData = async () => {
      setLoading(true);
      const response = await fetchProductsBySubCategory(subCategoryId);
      if (response?.data) {
        const parsedProducts = response.data.map(product => {
          try {
            const customFields = JSON.parse(product.custom_fields || '[]');

            const extractField = name =>
              customFields.find(f => f.name === name)?.value || '';

            return {
              ...product,
              buildYear: extractField('yearofManufacture'),
              brand: extractField('make_Brand'),
              transmission: extractField('transmission'),
              fuelType: extractField('fuelType'),
              mileage: extractField('mileage'),
              model: extractField('model'),
              power: extractField('power'),
              condition: extractField('condition'),
              inspection: extractField('inspectionValidUntil'),
              // accidentFree: extractField('accidentFree') === 'Yes',
              color: extractField('color'),
              location: extractField('registrationCity'),

              //Property Filters
              area: (() => {
                const rawSize = extractField('size') || '';
                const numeric = rawSize.replace(/[^\d]/g, '');
                return numeric ? Number(numeric) : 0;
              })(),
              propertyType: extractField('propertyType'),
              heating_Cooling: extractField('heating_Cooling'),
              water_electricityAvailability: extractField(
                'water_electricityAvailability',
              ),
              petsAllowed: extractField('petsAllowed'),
              parking: extractField('parking'),
              furnished: extractField('furnished'),
              elevator: extractField('elevator'),
              balcony: extractField('balcony'),
              titleDeed_Document: extractField('titleDeed_Document'),
              nearbyLandmarks: extractField('nearbyLandmarks'),
              distancefroCityCenter_transport: extractField(
                'distancefroCityCenter_transport',
              ),
              floorNumber: extractField('floorNumber'),
              totalFloorsInBuilding: extractField('totalFloorsInBuilding'),
              purpose: extractField('purpose'),
              rooms: extractField('rooms'),
              bathrooms: extractField('bathrooms'),
              size: extractField('size'),
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
    if (category === 'Vehicle') {return filterVehicleProducts(product, filters);}
    if (category === 'Property') {return filterPropertyProducts(product, filters);}
    return true;
  });
}, [products, filters, category]);
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
    if (refBrandSheet.current) {await refBrandSheet.current.close();}
    if (refPriceSheet.current) {await refPriceSheet.current.close();}
    if (refBuildYearSheet.current) {await refBuildYearSheet.current.close();}
    if (refTransmissionSheet.current)
      {await refTransmissionSheet.current.close();}
    if (refAdjustSheet.current) {await refAdjustSheet.current.close();} // ✅ Add this line

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
                  onOpenTransmissionSheet={() => {
                    closeAllSheets(() => {
                      refTransmissionSheet.current?.expand();
                      setActiveSheet('transmission');
                    });
                  }}
                  onOpenAdjustSheet={() => {
                    closeAllSheets(() => {
                      refAdjustSheet.current?.expand();
                      setActiveSheet('adjust');
                    });
                  }}
                />
              </View>
            )}
            {category?.toLowerCase() === 'property' && (
              <View style={{height: 60}}>
                <PropertyFilters
                  filters={filters}
                  setFilters={setFilters}
                  onOpenPriceSheet={() => {
                    closeAllSheets(() => {
                      refPriceSheet.current?.expand();
                      setTimeout(() => {
                        refPriceInput.current?.focusMinPrice?.();
                      }, 300);
                    });
                  }}
                  onOpenPropertyTypeSheet={() =>
                    closeAllSheets(() => refPropertyTypeSheet.current?.expand())
                  }
                  onOpenAreaSheet={() => {
                    closeAllSheets(() => {
                      refAreaSheet.current?.expand();
                      setActiveSheet('area');
                    });
                  }}
                  onOpenAdjustSheet={() =>
                    closeAllSheets(() => refAdjustSheet.current?.expand())
                  }
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

<BottomSheetContainer
  ref={refBrandSheet}
  snapPoints={[MAX_SHEET_HEIGHT * 0.5, MAX_SHEET_HEIGHT]}
  activeSheet={activeSheet}
  sheetKey="brand"
  setActiveSheet={setActiveSheet}>
  <BrandFilterSheet
    refBrandSheet={refBrandSheet}
    filteredBrands={filteredBrands}
    brandSearch={brandSearch}
    setBrandSearch={setBrandSearch}
    setFilters={setFilters}
  />
</BottomSheetContainer>


            <BottomSheet
              ref={refPriceSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'price')
                  {setActiveSheet(null);}
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
              <View style={{padding: 16}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Price
                </Text>
                {/* Your custom controls here */}
              </View>
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
                  {setActiveSheet(null);}
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
              <View style={{padding: 16}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Build Year
                </Text>
              </View>
              <BuildYearFilterSheet
                filters={filters}
                setFilters={setFilters}
                ref={refBuildYearInput}
              />
            </BottomSheet>

            <BottomSheet
              ref={refTransmissionSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'transmission')
                  {setActiveSheet(null);}
              }}
              index={-1}
              snapPoints={[mvs(150), MAX_PRICE_HEIGHT]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              <View style={{padding: 16}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Transmission
                </Text>
                {/* Your custom controls here */}
              </View>
              <TransmissionFilterSheet
                filters={filters}
                setFilters={setFilters}
                closeSheet={() => refTransmissionSheet.current?.close()}
              />
            </BottomSheet>

            <BottomSheet
              ref={refAdjustSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'adjust')
                  {setActiveSheet(null);}
              }}
              index={-1}
              snapPoints={[MAX_SHEET_HEIGHT * 0.6]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              {category?.toLowerCase() === 'vehicle' ? (
                <AdjustFilterSheet
                  filters={filters}
                  setFilters={setFilters}
                  closeSheet={() => refAdjustSheet.current?.close()}
                  onOpenBrandSheet={() =>
                    closeAllSheets(() => refBrandSheet.current?.snapToIndex(1))
                  }
                  onOpenPriceSheet={() =>
                    closeAllSheets(() => {
                      refPriceSheet.current?.expand();
                      setTimeout(() => {
                        refPriceInput.current?.focusMinPrice();
                      }, 300);
                    })
                  }
                  onOpenTransmissionSheet={() =>
                    closeAllSheets(() => refTransmissionSheet.current?.expand())
                  }
                  onOpenBuildYearSheet={() =>
                    // ✅ Add this new prop
                    closeAllSheets(() => {
                      refBuildYearSheet.current?.expand();
                      setTimeout(() => {
                        refBuildYearInput.current?.focusMinYear();
                      }, 300);
                    })
                  }
                />
              ) : (
                <PropertyAdjustFilterSheet
                  filters={filters}
                  setFilters={setFilters}
                  closeSheet={() => refAdjustSheet.current?.close()}
                />
              )}
            </BottomSheet>

            <BottomSheet
              ref={refAreaSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'area')
                  {setActiveSheet(null);}
              }}
              index={-1}
              snapPoints={[mvs(150), MAX_PRICE_HEIGHT]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              <View style={{padding: 16}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Area (sqft)
                </Text>
              </View>
              <AreaFilterSheet
                ref={refAreaInput}
                filters={filters}
                setFilters={setFilters}
              />
            </BottomSheet>

            <BottomSheet
              ref={refPropertyTypeSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'propertyType')
                  {setActiveSheet(null);}
              }}
              index={-1}
              snapPoints={[mvs(150), MAX_PRICE_HEIGHT]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              <View style={{padding: 16}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Property Type
                </Text>
              </View>
              <PropertyTypeFilterSheet
                filters={filters}
                setFilters={setFilters}
                closeSheet={() => refPropertyTypeSheet.current?.close()}
              />
            </BottomSheet>
          </>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Products;
