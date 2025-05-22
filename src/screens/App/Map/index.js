import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  FlatList,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useNavigation, useRoute} from '@react-navigation/native';
// Remove the isEqual import - we don't need it anymore
import MainHeader from '../../../components/Headers/MainHeader';
import {
  BarsSVG,
  CurrentLocationSVG,
  ForwardSVG,
  NoneSVG,
} from '../../../assets/svg';
import {mvs} from '../../../util/metrices';
import styles from './styles';
import {useSelector} from 'react-redux';
import {colors} from '../../../util/color';

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

  // Add refs for debouncing
  const regionUpdateTimeoutRef = useRef(null);

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

  // Memoize visible products calculation - ONLY for the bottom counter
  const visibleProducts = useMemo(() => {
    if (!region || !allProducts?.length) return [];

    // First filter by region
    let filtered = allProducts.filter(product => {
      const lat = parseFloat(product.lat);
      const lng = parseFloat(product.long);

      if (isNaN(lat) || isNaN(lng)) return false;

      const latMin = region.latitude - region.latitudeDelta / 2;
      const latMax = region.latitude + region.latitudeDelta / 2;
      const lngMin = region.longitude - region.longitudeDelta / 2;
      const lngMax = region.longitude + region.longitudeDelta / 2;

      return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
    });

    // Then apply category filter if a category is selected
    if (activeCategory) {
      filtered = filtered.filter(
        product => product.category && product.category.name === activeCategory,
      );
    }

    return filtered;
  }, [region, allProducts, activeCategory]);

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

  // Close dropdown when clicking outside
  const closeDropdownOnOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  // Add this reference for map
  const mapRef = useRef(null);
  const locationRetryCount = useRef(0);
  const initialLocationRequestedRef = useRef(false);
  const focusLocationOnNextReadyRef = useRef(false);
  const maxRetries = 3;

  const categories = useSelector(state => state.category.categories);

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

  // Improved location focus logic with batched updates
  const focusUserLocation = useCallback(
    coords => {
      if (!coords) return;

      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      };

      // Batch state updates to prevent multiple re-renders
      // React.unstable_batchedUpdates(() => {
        setUserLocation(coords);
        setRegion(newRegion);
      // });

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

const getCurrentLocation = useCallback(() => {
  if (isLocationLoading) return;
  
  setIsLocationLoading(true);
  
  Geolocation.getCurrentPosition(
    (position) => {
      setIsLocationLoading(false);
      const { latitude, longitude } = position.coords;
      focusUserLocation({ latitude, longitude });
    },
    (error) => {
      setIsLocationLoading(false);
      console.log('Location error:', error);
      
      // Better error handling
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          Alert.alert('Permission Denied', 'Location access was denied');
          break;
        case 2: // POSITION_UNAVAILABLE
          Alert.alert('Location Unavailable', 'Unable to determine location');
          break;
        case 3: // TIMEOUT
          Alert.alert('Location Timeout', 'Location request timed out');
          break;
        default:
          Alert.alert('Location Error', 'Failed to get location');
      }
      setDefaultRegion();
    },
    {
      enableHighAccuracy: false, // Start with less accuracy for faster response
      timeout: 10000,
      maximumAge: 30000,
    }
  );
}, [isLocationLoading, focusUserLocation]);

  const requestLocationPermission = async () => {
  try {
    const permission = Platform.OS === 'ios' 
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
        Alert.alert('Permission Blocked', 'Please enable location in settings');
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
    if (!categoryName || categoryName === 'All') {
      return products;
    } else {
      return products.filter(
        product => product.category && product.category.name === categoryName,
      );
    }
  };

useEffect(() => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: true, // Handle permissions manually
    authorizationLevel: 'whenInUse',
    locationProvider: 'playServices', // More reliable on Android
  });
    // Slight delay to ensure component is fully mounted
    
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

  // Handle map ready - this is critical for focusing
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

  // Debounced region update handler
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
          Math.abs(newRegion.latitude - region.latitude) > 0.001 || // Increased threshold
          Math.abs(newRegion.longitude - region.longitude) > 0.001
        ) {
          setRegion(newRegion);
        }
      }, 150); // Debounce delay
    },
    [region],
  );

  const formatPrice = price => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return price.toString();
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader showBackIcon={true} title="Map" />

      <View style={styles.categoryListContainer}>
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.dropdownButton}>
          <BarsSVG width={24} height={24} />
          <Text style={{fontSize: mvs(18), fontWeight: 'bold'}}>
            {' '}
            Categories
          </Text>
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
            <Text style={styles.dropdownText}>All Categories</Text>
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
              <Text style={styles.dropdownText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Bottom container for products info */}
      <View style={styles.BottomContainer}>
        {selectedProductsGroup ? (
          <View style={styles.productGroupContainer}>
            <View style={styles.productGroupHeader}>
              <Text style={styles.productGroupTitle}>
                {selectedProductsGroup.length} Product
                {selectedProductsGroup.length > 1 ? 's' : ''} Available
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedProductsGroup(null)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedProductsGroup}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
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
                      <View
                        style={[
                          styles.productImage,
                          styles.noImagePlaceholder,
                        ]}>
                        <Text>No Image</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text
                      style={styles.productLocation}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.location}
                    </Text>
                    <View style={styles.priceTagContainer}>
                      <Text style={styles.priceTag}>{item.price} - USD</Text>
                      {item.condition != 2 ? (
                        <Text style={styles.conditionTag}>New</Text>
                      ) : (
                        <Text style={styles.conditionTag}>Used</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: mvs(15), fontWeight: '400'}}>
              In this region:
            </Text>
            <Text style={{fontSize: mvs(22), fontWeight: 'bold'}}>
              {visibleProducts.length} ads
            </Text>
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation={false}
          showsMyLocationButton={false}
          onRegionChangeComplete={handleRegionChangeComplete}
          onMapReady={handleMapReady}>
          {/* Render markers for grouped products - NOW SHOWS ALL PRODUCTS */}
          {Object.entries(filteredGroupedProducts).map(
            ([locationKey, products]) => {
              const [lat, long] = locationKey.split(',').map(parseFloat);

              // Skip invalid coordinates
              if (isNaN(lat) || isNaN(long)) return null;

              // Calculate average price or use first product price as indicator
              const averagePrice =
                products.reduce(
                  (sum, product) => sum + parseFloat(product.price),
                  0,
                ) / products.length;

              return (
                <Marker
                  key={locationKey}
                  coordinate={{
                    latitude: lat,
                    longitude: long,
                  }}
                  onPress={() => handleMarkerPress(locationKey)}>
                  <View
                    style={{
                      backgroundColor: colors.lightgreen,
                      borderRadius: 4,
                      padding: 1,
                      width: products.length > 1 ? 38 : 35,
                      height: products.length > 1 ? 38 : 35,
                      borderWidth: 1,
                      borderColor: '#ccc', 
                      justifyContent: 'center',
                    }}>

                      {products.length == 1 && (
                        <Text
                        style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#fff',
                        textAlign: 'center',
                      }}>$</Text>
                      )}
                    <Text
                      style={{
                        fontSize: products.length > 1 ? 10 : 12,
                        fontWeight: 'bold',
                        color: '#fff',
                        textAlign: 'center',
                      }}>
                      {formatPrice(averagePrice)}
                    </Text>
                    {products.length > 1 && (
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          color: '#fff',
                        }}>
                        {products.length} items
                      </Text>
                    )}
                  </View>
                </Marker>
              );
            },
          )}
        </MapView>

        <TouchableOpacity
          style={[
            styles.myLocationButton,
            {bottom: mvs(selectedProductsGroup ? 240 : 110)}, // conditional bottom
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