import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useNavigation, useRoute} from '@react-navigation/native';
import MainHeader from '../../../components/Headers/MainHeader';
import {BarsSVG, CurrentLocationSVG} from '../../../assets/svg';
import {mvs} from '../../../util/metrices';
import styles from './styles';
import {useSelector} from 'react-redux';
import {colors} from '../../../util/color';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../components/CustomText';
import i18n from '../../../i18n/i18n';
// Memoized Marker Component to prevent unnecessary re-renders
const MarkerComponent = React.memo(({item, onPress}) => (
  <Marker
    key={item.key}
    coordinate={item.coordinate}
    onPress={() => onPress(item.key)}>
    <View
      style={[
        markerStyles.container,
        item.isMultiple ? markerStyles.multiple : markerStyles.single,
      ]}>
      {!item.isMultiple && (
        <CustomText style={markerStyles.dollarSign}>$</CustomText>
      )}
      <CustomText
        style={[markerStyles.priceText, {fontSize: item.isMultiple ? 10 : 12}]}>
        {item.formattedPrice}
      </CustomText>
      {item.isMultiple && (
        <CustomText style={markerStyles.itemCount}>
          {item.products.length} items
        </CustomText>
      )}
    </View>
  </Marker>
));

// Pre-calculated marker styles
const markerStyles = {
  container: {
    backgroundColor: colors.lightgreen,
    borderRadius: 4,
    padding: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
  },
  single: {width: 35, height: 35},
  multiple: {width: 35, height: 35},
  dollarSign: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  priceText: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  itemCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
};

export default function MapScreen() {
  const route = useRoute();
  const {allProducts} = route.params;

  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [selectedProductsGroup, setSelectedProductsGroup] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const {t} = useTranslation();

  // Add refs for debouncing
  const regionUpdateTimeoutRef = useRef(null);
  const mapRef = useRef(null);
  const locationRetryCount = useRef(0);
  const initialLocationRequestedRef = useRef(false);
  const focusLocationOnNextReadyRef = useRef(false);
  const maxRetries = 3;
  const flatListRef = useRef(null);
  const categories = useSelector(state => state.category.categories);

  // Memoize format price function
  const formatPrice = useCallback(price => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return price.toString();
    }
  }, []);

  // Group products by location - memoized to prevent unnecessary recalculations
  const groupedProductsByLocation = useMemo(() => {
    const groupedProducts = {};

    if (allProducts && allProducts.length > 0) {
      allProducts.forEach(product => {
        const lat = parseFloat(product.lat);
        const long = parseFloat(product.long);

        // Skip products with invalid coordinates
        if (isNaN(lat) || isNaN(long)) return;

        // Use coordinates as key (rounded to 5 decimal places for precision)
        const locationKey = `${lat.toFixed(5)},${long.toFixed(5)}`;

        if (!groupedProducts[locationKey]) {
          groupedProducts[locationKey] = [];
        }

        groupedProducts[locationKey].push(product);
      });
    }

    return groupedProducts;
  }, [allProducts]);

  // Modified: Show ALL products on map, only filter by category (not region)
  const filteredGroupedProducts = useMemo(() => {
    if (!activeCategory) return groupedProductsByLocation;

    const filtered = {};
    Object.entries(groupedProductsByLocation).forEach(
      ([locationKey, products]) => {
        const categoryFiltered = products.filter(
          product =>
            product.category && product.category.name === activeCategory,
        );
        if (categoryFiltered.length > 0) {
          filtered[locationKey] = categoryFiltered;
        }
      },
    );

    return filtered;
  }, [groupedProductsByLocation, activeCategory]);

  // Optimized marker data calculation
  const markerData = useMemo(() => {
    return Object.entries(filteredGroupedProducts)
      .map(([locationKey, products]) => {
        const [lat, long] = locationKey.split(',').map(parseFloat);
        if (isNaN(lat) || isNaN(long)) return null;

        const averagePrice =
          products.reduce(
            (sum, product) => sum + parseFloat(product.price),
            0,
          ) / products.length;

        return {
          key: locationKey,
          coordinate: {latitude: lat, longitude: long},
          products,
          averagePrice,
          formattedPrice: formatPrice(averagePrice),
          isMultiple: products.length > 1,
        };
      })
      .filter(Boolean);
  }, [filteredGroupedProducts, formatPrice]);

  // Optimized visible products calculation with larger threshold for better performance
  const visibleProducts = useMemo(() => {
    if (!region || !allProducts?.length || isAnimating) return [];

    const threshold = 0.01; // Larger threshold for better performance
    const latMin = region.latitude - region.latitudeDelta / 2 - threshold;
    const latMax = region.latitude + region.latitudeDelta / 2 + threshold;
    const lngMin = region.longitude - region.longitudeDelta / 2 - threshold;
    const lngMax = region.longitude + region.longitudeDelta / 2 + threshold;

    return allProducts.filter(product => {
      const lat = parseFloat(product.lat);
      const lng = parseFloat(product.long);

      return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= latMin &&
        lat <= latMax &&
        lng >= lngMin &&
        lng <= lngMax &&
        (!activeCategory || product.category?.name === activeCategory)
      );
    });
  }, [
    region?.latitude,
    region?.longitude,
    region?.latitudeDelta,
    region?.longitudeDelta,
    allProducts,
    activeCategory,
    isAnimating,
  ]);

  useEffect(() => {
    if (selectedProductsGroup && flatListRef.current) {
      // Small delay to ensure FlatList has rendered
      setTimeout(() => {
        flatListRef.current.scrollToOffset({offset: 0, animated: false});
      }, 100);
    }
  }, [selectedProductsGroup]);

  // Static MapView props to prevent unnecessary updates
  const mapViewProps = useMemo(
    () => ({
      provider: Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE,
      showsUserLocation: false,
      showsMyLocationButton: false,
      showsCompass: false,
      showsScale: false,
      rotateEnabled: true, // Keep enabled for better UX
      pitchEnabled: false, // Disable for better performance
    }),
    [],
  );

  // FlatList optimization functions
  const getItemLayout = useCallback(
    (data, index) => ({
      length: 200, // Fixed item width
      offset: 200 * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  // Close dropdown when clicking outside
  const closeDropdownOnOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  const setDefaultRegion = useCallback(() => {
    if (allProducts && allProducts.length > 0) {
      let totalLat = 0;
      let totalLong = 0;
      let validProducts = 0;

      allProducts.forEach(product => {
        const lat = parseFloat(product.lat);
        const long = parseFloat(product.long);

        if (!isNaN(lat) && !isNaN(long)) {
          totalLat += lat;
          totalLong += long;
          validProducts++;
        }
      });

      if (validProducts > 0) {
        const avgLat = totalLat / validProducts;
        const avgLong = totalLong / validProducts;

        const newRegion = {
          latitude: avgLat,
          longitude: avgLong,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        };

        setRegion(newRegion);

        // If map is already ready, animate to this region
        if (mapReady && mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    }
  }, [allProducts, mapReady]);

  // Improved location focus logic with batched updates - GEOLOCATION PRESERVED
  const focusUserLocation = useCallback(
    coords => {
      if (!coords) return;

      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      };

      // Preserve original geolocation logic
      setUserLocation(coords);
      setRegion(newRegion);

      // Animate map if ready
      if (mapReady && mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500);
      } else {
        // If map isn't ready yet, flag to focus when it is
        focusLocationOnNextReadyRef.current = true;
      }
    },
    [mapReady],
  );

  // PRESERVED GEOLOCATION LOGIC - No changes to location functionality
  const getCurrentLocation = useCallback(() => {
    if (isLocationLoading) return;

    setIsLocationLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        setIsLocationLoading(false);
        const {latitude, longitude} = position.coords;
        focusUserLocation({latitude, longitude});
      },
      error => {
        setIsLocationLoading(false);
        console.log('Location error:', error);

        // Better error handling
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            Alert.alert(t('permissionDenied'), t('Location access was denied'));
            break;
          case 2: // POSITION_UNAVAILABLE
            Alert.alert(
              t('locationUnavailable'),
              t('Unable to determine location'),
            );
            break;
          case 3: // TIMEOUT
            Alert.alert(t('Location Timeout'), t('Location request timed out'));
            break;
          default:
            Alert.alert(t('Location Error'), t('Failed to get location'));
        }
        setDefaultRegion();
      },
      {
        enableHighAccuracy: false, // Start with less accuracy for faster response
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, [isLocationLoading, focusUserLocation, setDefaultRegion]);

  // PRESERVED GEOLOCATION LOGIC
  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);

      switch (result) {
        case RESULTS.GRANTED:
          getCurrentLocation();
          break;
        case RESULTS.DENIED:
          Alert.alert('Permission Required', 'Location access is needed');
          setDefaultRegion();
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            'Permission Blocked',
            'Please enable location in settings',
          );
          setDefaultRegion();
          break;
        default:
          setDefaultRegion();
      }
    } catch (error) {
      console.error('Permission error:', error);
      setDefaultRegion();
    }
  };

  const filterProductsByCategory = (products, categoryName) => {
    if (!categoryName || categoryName === t('All')) {
      return products;
    } else {
      return products.filter(
        product => product.category && product.category.name === categoryName,
      );
    }
  };

  // PRESERVED GEOLOCATION INITIALIZATION
  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: true, // Handle permissions manually
      authorizationLevel: 'whenInUse',
      locationProvider: 'playServices', // More reliable on Android
    });

    requestLocationPermission();

    return () => {
      initialLocationRequestedRef.current = false;
      focusLocationOnNextReadyRef.current = false;
      // Clear any pending timeouts
      if (regionUpdateTimeoutRef.current) {
        clearTimeout(regionUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Handle map ready - PRESERVED GEOLOCATION LOGIC
  const handleMapReady = () => {
    setMapReady(true);

    // If we have user location but couldn't focus before, focus now
    if (focusLocationOnNextReadyRef.current && userLocation) {
      const newRegion = {
        ...userLocation,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      };

      // Use a short timeout to ensure the map is fully ready
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 500);
        }
      }, 300);

      focusLocationOnNextReadyRef.current = false;
    }
    // If no user location yet but we have products, show those
    else if (!userLocation && !region) {
      setDefaultRegion();
    }
  };

  // Optimized region change handlers
  const handleRegionWillChange = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const handleRegionDidChange = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Optimized debounced region update handler
  const handleRegionChangeComplete = useCallback(
    newRegion => {
      // Clear any existing timeout
      if (regionUpdateTimeoutRef.current) {
        clearTimeout(regionUpdateTimeoutRef.current);
      }

      // Set a new timeout to debounce the region update
      regionUpdateTimeoutRef.current = setTimeout(() => {
        if (
          !region ||
          Math.abs(newRegion.latitude - region.latitude) > 0.005 || // Increased threshold
          Math.abs(newRegion.longitude - region.longitude) > 0.005
        ) {
          setRegion(newRegion);
        }
      }, 100); // Reduced debounce delay
    },
    [region],
  );

  const navigateToProductDetails = productId => {
    navigation.navigate('ProductDetail', {productId});
    console.log('Product ID: ', productId);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Modified to accept locationKey instead of a single product
  const handleMarkerPress = useCallback(
    locationKey => {
      if (filteredGroupedProducts[locationKey]) {
        setSelectedProductsGroup(filteredGroupedProducts[locationKey]);
      }
    },
    [filteredGroupedProducts],
  );

  // PRESERVED GEOLOCATION LOGIC
  const goToMyLocation = () => {
    locationRetryCount.current = 0;
    getCurrentLocation();
  };

  const RadioButton = ({selected}) => {
    return (
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: colors.lightgreen,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}>
        {selected ? (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.lightgreen,
            }}
          />
        ) : null}
      </View>
    );
  };

  // Optimized product card renderer
  const renderProductCard = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => navigateToProductDetails(item.id)}
        style={styles.productCardContainer}>
        <View style={styles.productImageContainer}>
          {item.images && item.images.length > 0 ? (
            <Image
              source={{
                uri: `https://backend.souqna.net${item.images[0].path}`,
              }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.productImage, styles.noImagePlaceholder]}>
              <CustomText>No Image</CustomText>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <CustomText style={styles.productTitle} numberOfLines={1}>
            {item.name}
          </CustomText>
          <CustomText
            style={styles.productLocation}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.location}
          </CustomText>
          <View style={styles.priceTagContainer}>
            <CustomText style={styles.priceTag}>{item.price} - USD</CustomText>
            {item.condition != 2 ? (
              <CustomText style={styles.conditionTag}>New</CustomText>
            ) : (
              <CustomText style={styles.conditionTag}>Used</CustomText>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader showBackIcon={true} title={t('map')} />

      <View style={styles.categoryListContainer}>
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.dropdownButton}>
          <BarsSVG width={24} height={24} />
          <View style={{flexShrink: 1}}>
            <CustomText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{fontSize: mvs(18), fontWeight: 'bold', flexShrink: 1}}>
              {' '}
              {activeCategory ? `${activeCategory}` : t('Categories')}
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <TouchableWithoutFeedback onPress={closeDropdownOnOutsidePress}>
          <View style={styles.dropdownOverlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Simple dropdown (replace modal) */}
      {dropdownVisible && (
        <ScrollView style={styles.simpleDropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setActiveCategory(null);
              setDropdownVisible(false);
            }}>
            <RadioButton selected={activeCategory === null} />
            <CustomText
              style={styles.dropdownText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {t('All Categories')}
            </CustomText>
          </TouchableOpacity>

          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={styles.dropdownItem}
              onPress={() => {
                setActiveCategory(category.name);
                setDropdownVisible(false);
              }}>
              <RadioButton selected={activeCategory === category.name} />
              <CustomText
                style={styles.dropdownText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {i18n.language === 'ar' ? category.ar_name : category.name}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Bottom container for products info */}
      <View style={styles.BottomContainer}>
        {selectedProductsGroup ? (
          <View style={styles.productGroupContainer}>
            <View style={styles.productGroupHeader}>
              <CustomText style={styles.productGroupTitle}>
                {selectedProductsGroup.length} Ad
                {selectedProductsGroup.length > 1 ? 's' : ''} Available
              </CustomText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedProductsGroup(null)}>
                <CustomText style={styles.closeButtonText}>×</CustomText>
              </TouchableOpacity>
            </View>

            <FlatList
              ref={flatListRef}
              data={selectedProductsGroup}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderProductCard}
              getItemLayout={getItemLayout}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              windowSize={10}
            />
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <CustomText style={{fontSize: mvs(15), fontWeight: '400'}}>
              {t('In this region:')}
            </CustomText>
            <CustomText style={{fontSize: mvs(22), fontWeight: 'bold'}}>
              {visibleProducts.length} {t('ads')}
            </CustomText>
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          {...mapViewProps}
          style={styles.map}
          region={region}
          onRegionWillChange={handleRegionWillChange}
          onRegionDidChange={handleRegionDidChange}
          onRegionChangeComplete={handleRegionChangeComplete}
          onMapReady={handleMapReady}>
          {/* Optimized markers rendering */}
          {markerData.map(item => (
            <MarkerComponent
              key={item.key}
              item={item}
              onPress={handleMarkerPress}
            />
          ))}
        </MapView>

        <TouchableOpacity
          style={[
            styles.myLocationButton,
            {bottom: mvs(selectedProductsGroup ? 300 : 110)}, // conditional bottom
          ]}
          onPress={goToMyLocation}
          disabled={isLocationLoading}>
          <CurrentLocationSVG width={24} height={24} />
          {isLocationLoading && <View style={styles.loadingIndicator} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
