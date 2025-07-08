/* eslint-disable no-lone-blocks */
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
import {HeartSvg, MapMarkerSVG, SortSVG} from '../../../assets/svg';
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
import {
  filterPropertyProducts,
  filterServiceProducts,
  filterVehicleProducts,
} from '../../../util/Filtering/filterProducts';
import BottomSheetContainer from '../../../components/Sheets/BottomSheetContainer';
import {getCurrencySymbol} from '../../../util/Filtering/helpers';
import {BRANDS} from '../../../util/Filtering/constants';
import ServicesFilters from '../../../components/atoms/ServicesFilter';
import ServiceAdjustFilterSheet from '../../../components/Sheets/Services/ServiceAdjustFilterSheet';
import ServiceTypeFilterSheet from '../../../components/Sheets/Services/ServiceTypeFilterSheet';
import {parseProductList} from '../../../util/Filtering/parseProductsList';
import SortSheet from '../../../components/Sheets/SortSheet';
import {init} from 'i18next';
import {colors} from '../../../util/color';

const Products = () => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: [],
    buildYearMin: '',
    buildYearMax: '',
    transmission: '',
    fuelType: '',
    model: '',
    mileage: '',
    power: '',
    condition: '',
    inspection: '',
    color: '',
    minMileage: '',
    maxMileage: '',
    location: '',
    radius: '',
    lat: '',
    long: '',

    propertyType: '',
    minArea: '',
    maxArea: '',

    serviceType: '',
    employmentType: '',
    educationRequired: '',
    experienceRequired: '',
    genderPreference: '',
    contactMethod: '',
    salaryType: '',
  });
  const [products, setProducts] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [sortOption, setSortOption] = useState(null);

  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState({});
  const {t} = useTranslation();

  const refBrandSheet = useRef(null);
  const refPriceSheet = useRef(null);
  const refPriceInput = useRef(null);
  const refBuildYearSheet = useRef(null);
  const refBuildYearInput = useRef(null);
  const refTransmissionSheet = useRef(null);
  const refVehicleAdjustSheet = useRef(null);
  const refPropertyAdjustSheet = useRef(null);
  const refServiceAdjustSheet = useRef(null);
  const refSortSheet = useRef(null);

  const refPropertyTypeSheet = useRef(null);
  const refAreaSheet = useRef(null);
  const refAreaInput = useRef(null);

  const refServiceTypeSheet = useRef(null);
  const refLocationSheet = useRef(null);

  const {role, id: userId, email: userEmail} = useSelector(state => state.user);
  const activeRole = role ?? 3;
  const favorites = useSelector(state => state.favorites.favorites);
  const [activeSheet, setActiveSheet] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {id: subCategoryId, name, category, initialProducts} = route.params;
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;
  const MAX_PRICE_HEIGHT = SCREEN_HEIGHT * 0.5;
  const [allProducts, setAllProducts] = useState([]);

  const [brandSearch, setBrandSearch] = useState('');
  const filteredBrands = useMemo(() => {
    return BRANDS.filter(brand =>
      brand.toLowerCase().includes(brandSearch.toLowerCase()),
    );
  }, [brandSearch]);

  const likedItemsMap = useMemo(() => {
    return favorites.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
  }, [favorites]);

  const navigateToProductDetails = useCallback(
    productId => {
      navigation.navigate('ProductDetail', {productId});
    },
    [navigation],
  );

  const handleHeartClick = useCallback(
    (id, product) => {
      if (likedItems[id]) {
        dispatch(removeFavorite(product));
        setLikedItems(prev => {
          const updatedState = {...prev};
          delete updatedState[id];
          return updatedState;
        });
      } else {
        dispatch(addFavorite(product));
        setLikedItems(prev => ({
          ...prev,
          [id]: true,
        }));
      }
    },
    [likedItems, dispatch],
  );

  const closeAllSheets = useCallback(async callback => {
    Keyboard.dismiss();
    await Promise.all([
      refBrandSheet.current?.close(),
      refPriceSheet.current?.close(),
      refBuildYearSheet.current?.close(),
      refTransmissionSheet.current?.close(),
      refVehicleAdjustSheet.current?.close(),
      refPropertyAdjustSheet.current?.close(),
      refServiceAdjustSheet.current?.close(),
      refServiceTypeSheet.current?.close(),
      refLocationSheet.current?.close(),
    ]);
    callback?.();
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
      />
    ),
    [],
  );

  useEffect(() => {
    if (initialProducts?.length > 0) {
      setLoading(true); // 👈 Start loader
      setProducts(initialProducts);
      setAllProducts(initialProducts);
      console.log('FETCHEDPRODUCTS:', initialProducts);
      setTimeout(() => setLoading(false), 200);
      return;
    }

    if (subCategoryId && productsMap[subCategoryId]) {
      setProducts(productsMap[subCategoryId]);
      return;
    }

    if (!subCategoryId && !initialProducts?.length) return;

    const fetchData = async () => {
      setLoading(true);
      const response = await fetchProductsBySubCategory(subCategoryId);
      if (response?.data) {
        const parsed = parseProductList(response.data);
        setProducts(parsed);
        setAllProducts(parsed);
        setProductsMap(prev => ({...prev, [subCategoryId]: parsed}));
        console.log('FetchedPRODUCTS:', response.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [subCategoryId, initialProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    // Filter based on category filters
    let result = products.filter(product => {
      let passesCategoryFilter = true;

      if (category === 'Vehicle') {
        passesCategoryFilter = filterVehicleProducts(product, filters);
      } else if (category === 'Property') {
        passesCategoryFilter = filterPropertyProducts(product, filters);
      } else if (category === 'Services') {
        passesCategoryFilter = filterServiceProducts(product, filters);
      }

      // ✅ Additionally filter by seller email if role === 3
      const isSellerMatch =
        activeRole === 2 ? product?.seller?.email === userEmail : true;

      return passesCategoryFilter && isSellerMatch;
    });

    // Sort results
    switch (sortOption) {
      case 'Newest First':
        result = result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        break;
      case 'Oldest First':
        result = result.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
        break;
      case 'Price: Low to High':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result = result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [products, filters, sortOption, category, role, userEmail]);

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
            <HeartSvg filled={likedItemsMap[item.id]} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ),
    [navigateToProductDetails, handleHeartClick, likedItemsMap],
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={[styles.container, {position: 'relative'}]}>
        <StatusBar barStyle="dark-content" />
        <MainHeader title={name} showBackIcon />

        {role !== 2 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Map', {allProducts})}
            // onPress={() => setModalVisible(true)}
            style={styles.mapContainer}>
            <MapMarkerSVG width={35} height={35} fill={colors.white} />
          </TouchableOpacity>
        )}

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
            {role !== 2 && (
              <>
                {category?.toLowerCase() === 'vehicle' && (
                  <View style={{height: 60}}>
                    <CarFilters
                      filters={filters}
                      setFilters={setFilters}
                      sortOption={sortOption}
                      setSortOption={setSortOption}
                      onOpenSortSheet={() => {
                        closeAllSheets(() => {
                          refSortSheet.current?.expand();
                          setActiveSheet('sort');
                        });
                      }}
                      onOpenBrandSheet={() => {
                        closeAllSheets(() =>
                          refBrandSheet.current?.snapToIndex(1),
                        );
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
                          refVehicleAdjustSheet.current?.expand();
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
                      sortOption={sortOption}
                      setSortOption={setSortOption}
                      onOpenSortSheet={() => {
                        closeAllSheets(() => {
                          refSortSheet.current?.expand();
                          setActiveSheet('sort');
                        });
                      }}
                      onOpenPriceSheet={() => {
                        closeAllSheets(() => {
                          refPriceSheet.current?.expand();
                          setTimeout(() => {
                            refPriceInput.current?.focusMinPrice?.();
                          }, 300);
                        });
                      }}
                      onOpenPropertyTypeSheet={() =>
                        closeAllSheets(() =>
                          refPropertyTypeSheet.current?.expand(),
                        )
                      }
                      onOpenAreaSheet={() => {
                        closeAllSheets(() => {
                          refAreaSheet.current?.expand();
                          setActiveSheet('area');
                        });
                      }}
                      onOpenPropertyAdjust={() => {
                        closeAllSheets(() => {
                          refPropertyAdjustSheet.current?.expand();
                          setActiveSheet('property');
                        });
                      }}
                    />
                  </View>
                )}
                {category?.toLowerCase() === 'services' && (
                  <View style={{height: 60}}>
                    <ServicesFilters
                      filters={filters}
                      setFilters={setFilters}
                      sortOption={sortOption}
                      setSortOption={setSortOption}
                      onOpenSortSheet={() => {
                        closeAllSheets(() => {
                          refSortSheet.current?.expand();
                          setActiveSheet('sort');
                        });
                      }}
                      onOpenPriceSheet={() => {
                        closeAllSheets(() => {
                          refPriceSheet.current?.expand();
                          setTimeout(() => {
                            refPriceInput.current?.focusMinPrice?.();
                          }, 300);
                        });
                      }}
                      onOpenServiceTypeSheet={() =>
                        closeAllSheets(() =>
                          refServiceTypeSheet.current?.expand(),
                        )
                      }
                      onOpenLocationSheet={() =>
                        closeAllSheets(() => refLocationSheet.current?.expand())
                      }
                      onOpenServiceAdjustSheet={() => {
                        closeAllSheets(() => {
                          refServiceAdjustSheet.current?.expand();
                          setActiveSheet('services');
                        });
                      }}
                    />
                  </View>
                )}
              </>
            )}
            <FlatList
              data={filteredAndSortedProducts}
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
                filters={filters}
              />
            </BottomSheetContainer>

            <BottomSheet
              ref={refPriceSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'price') {
                  setActiveSheet(null);
                }
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
                if (index === -1 && activeSheet === 'year') {
                  setActiveSheet(null);
                }
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
                if (index === -1 && activeSheet === 'transmission') {
                  setActiveSheet(null);
                }
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
              ref={refAreaSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'area') {
                  setActiveSheet(null);
                }
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
                  Size (sqft)
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
                if (index === -1 && activeSheet === 'propertyType') {
                  setActiveSheet(null);
                }
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

            <BottomSheet
              ref={refSortSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'sort')
                  setActiveSheet(null);
              }}
              index={-1}
              snapPoints={['50%']}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              <SortSheet
                sortOption={sortOption}
                setSortOption={setSortOption}
                closeSheet={() => refSortSheet.current?.close()}
              />
            </BottomSheet>

            <BottomSheetContainer
              ref={refServiceTypeSheet}
              snapPoints={[MAX_SHEET_HEIGHT * 0.5]}
              activeSheet={activeSheet}
              sheetKey="serviceType"
              setActiveSheet={setActiveSheet}>
              <ServiceTypeFilterSheet
                filters={filters}
                setFilters={setFilters}
                closeSheet={() => refServiceTypeSheet.current?.close()}
              />
            </BottomSheetContainer>

            <BottomSheet
              ref={refVehicleAdjustSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'vehicle')
                  setActiveSheet(null);
              }}
              index={-1}
              snapPoints={[MAX_SHEET_HEIGHT]}
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
                  onOpenBrandSheet={() => {
                    closeAllSheets(() => {
                      refBrandSheet.current?.snapToIndex(1);
                      setActiveSheet('brand');
                    });
                  }}
                  onOpenPriceSheet={() => {
                    closeAllSheets(() => {
                      refPriceSheet.current?.expand();
                      setActiveSheet('price');
                      setTimeout(() => {
                        refPriceInput.current?.focusMinPrice();
                      }, 300);
                    });
                  }}
                  onOpenTransmissionSheet={() => {
                    closeAllSheets(() => {
                      refTransmissionSheet.current?.expand();
                      setActiveSheet('transmission');
                    });
                  }}
                  onOpenBuildYearSheet={() => {
                    closeAllSheets(() => {
                      refBuildYearSheet.current?.expand();
                      setActiveSheet('year');
                      setTimeout(() => {
                        refBuildYearInput.current?.focusMinYear();
                      }, 300);
                    });
                  }}
                  closeSheet={() => refVehicleAdjustSheet.current?.close()}
                />
              ) : null}
            </BottomSheet>

            <BottomSheet
              ref={refPropertyAdjustSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'property')
                  setActiveSheet(null);
              }}
              index={-1}
              snapPoints={[MAX_SHEET_HEIGHT * 0.8]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              {category?.toLowerCase() === 'property' ? (
                <PropertyAdjustFilterSheet
                  filters={filters}
                  setFilters={setFilters}
                  closeSheet={() => refPropertyAdjustSheet.current?.close()}
                />
              ) : null}
            </BottomSheet>

            <BottomSheet
              ref={refServiceAdjustSheet}
              onChange={index => {
                if (index === -1 && activeSheet === 'services')
                  setActiveSheet(null);
              }}
              index={-1}
              snapPoints={[MAX_SHEET_HEIGHT * 0.8]}
              enablePanDownToClose
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              detached={false}
              backdropComponent={renderBackdrop}
              style={{borderRadius: mvs(30), overflow: 'hidden'}}>
              {category?.toLowerCase() === 'services' ? (
                <ServiceAdjustFilterSheet
                  filters={filters}
                  setFilters={setFilters}
                  closeSheet={() => refServiceAdjustSheet.current?.close()}
                />
              ) : null}
            </BottomSheet>
          </>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Products;
