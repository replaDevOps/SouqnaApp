import React, {useState, useEffect, useRef, useCallback} from 'react';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useNavigation, useRoute} from '@react-navigation/native';
import isEqual from 'lodash.isequal';

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
console.log('[all producted]',allProducts);

  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Add this flag to track if initial location has been requested
  const initialLocationRequestedRef = useRef(false);

  const mapRef = useRef(null);
  const locationRetryCount = useRef(0);
  const initialMapLoadedRef = useRef(false);
  const maxRetries = 3;

  const categories = useSelector(state => state.category.categories);

  const isProductInVisibleRegion = (product, region) => {
    if (!region) return false;

    const lat = parseFloat(product.lat);
    const lng = parseFloat(product.long);

    const latMin = region.latitude - region.latitudeDelta / 2;
    const latMax = region.latitude + region.latitudeDelta / 2;
    const lngMin = region.longitude - region.longitudeDelta / 2;
    const lngMax = region.longitude + region.longitudeDelta / 2;

    return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
  };

  useEffect(() => {
    if (region && allProducts && allProducts.length > 0) {
      // First filter by region
      let filtered = allProducts.filter(product =>
        isProductInVisibleRegion(product, region),
      );
      // Then apply category filter if a category is selected
      if (activeCategory) {
        filtered = filterProductsByCategory(filtered, activeCategory);
      }
      if (!isEqual(filtered, visibleProducts)) {
        setVisibleProducts(filtered);
      }
    }
  }, [region, allProducts, activeCategory]); // Add activeCategory as dependency

  const setDefaultRegion = useCallback(() => {
    // Default region - can be centered on a specific city or location
    // or calculated from the average of product coordinates
    if (allProducts && allProducts.length > 0) {
      // Calculate average position from products if available
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
          latitudeDelta: 0.5, // Wider view to show more products
          longitudeDelta: 0.5,
        };

        setRegion(newRegion);
      }
    }
  }, [allProducts]);

  const getCurrentLocation = useCallback(() => {
    if (isLocationLoading) return;

    setIsLocationLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        setIsLocationLoading(false);
        locationRetryCount.current = 0;

        const {latitude, longitude} = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        };

        setUserLocation({latitude, longitude});
        setRegion(newRegion);

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion);
        }
      },
      error => {
        setIsLocationLoading(false);

        if (error.code === 3) {
          if (locationRetryCount.current < maxRetries) {
            locationRetryCount.current += 1;

            setTimeout(() => {
              Geolocation.getCurrentPosition(
                position => {
                  locationRetryCount.current = 0;

                  const {latitude, longitude} = position.coords;
                  const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.09,
                  };

                  setUserLocation({latitude, longitude});
                  setRegion(newRegion);

                  if (mapRef.current) {
                    mapRef.current.animateToRegion(newRegion);
                  }
                },
                retryError => {
                  if (locationRetryCount.current >= maxRetries) {
                    Alert.alert(
                      'Location Error',
                      'Unable to get your location after several attempts. Please check your device settings and try again.',
                      [
                        {text: 'OK'},
                        {
                          text: 'Open Settings',
                          onPress: () => {
                            // Optional: Link to open settings
                          },
                        },
                      ],
                    );
                    // Set default region if location fails
                    setDefaultRegion();
                  } else {
                    getCurrentLocation();
                  }
                },
                {
                  enableHighAccuracy: false,
                  timeout: 30000,
                  maximumAge: 60000,
                },
              );
            }, 1000);
          } else {
            Alert.alert(
              'Location Timeout',
              'Unable to get your current location. Please check your device location.',
              [
                {text: 'OK'},
                {
                  text: 'Try Again',
                  onPress: () => {
                    locationRetryCount.current = 0;
                    getCurrentLocation();
                  },
                },
              ],
            );
            // Set default region if location fails
            setDefaultRegion();
          }
        } else if (error.code === 1) {
          Alert.alert(
            'Location Access Denied',
            'Please enable location services in your device settings to use this feature.',
          );
          // Set default region if location is denied
          setDefaultRegion();
        } else if (error.code === 2) {
          Alert.alert(
            'Location Unavailable',
            'Your current location is unavailable. You might be in an area with poor GPS reception.',
          );
          // Set default region if location is unavailable
          setDefaultRegion();
        } else {
          Alert.alert('Error', 'Unable to get your current location.');
          // Set default region if there's a general error
          setDefaultRegion();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 10000,
        forceRequestLocation: true,
      },
    );
  }, [isLocationLoading, setDefaultRegion]);

  const requestLocationPermission = useCallback(async () => {
    // Prevent multiple location requests on initial load
    if (initialLocationRequestedRef.current) return;
    initialLocationRequestedRef.current = true;

    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      getCurrentLocation();
    } else {
      Alert.alert(
        'Location Permission',
        'Location permission is required to show your current location on the map.',
      );

      // Set a default region to show some products initially
      setDefaultRegion();
    }
  }, [getCurrentLocation, setDefaultRegion]);

  const filterProductsByCategory = (products, categoryName) => {
    if (!categoryName || categoryName === 'All') {
      // If no category is selected or "All" is selected, show all products
      return products;
    } else {
      // Filter products by the selected category name
      return products.filter(
        product => product.category && product.category.name === categoryName,
      );
    }
  };

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      locationProvider: 'auto',
    });

    // Request location permission once on component mount
    requestLocationPermission();

    return () => {
      initialMapLoadedRef.current = false;
      initialLocationRequestedRef.current = false; // Reset on unmount
    };
  }, []); // Remove dependency to ensure it only runs once on mount

  const formatPrice = price => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1).replace(/\.0$/, '') + 'm'; // 1.2m
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; // 1.5k
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

  const handleMarkerPress = product => {
    setSelectedProduct(product);
  };

  const goToMyLocation = () => {
    locationRetryCount.current = 0;
    getCurrentLocation();
  };

  const allCategoriesOption = {id: 'all', name: 'All'};
  const categoriesWithAll = [allCategoriesOption, ...categories];

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

  console.log('{catego}', categories);

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader showBackIcon={true} title="Map" />
      {/* Replace the category dropdown button and modal with this code */}
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
      {/* Simple dropdown (replace modal) */}
      {dropdownVisible && (
        <View style={styles.simpleDropdownContainer}>
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
        </View>
      )}

      <View style={styles.BottomContainer}>
        {selectedProduct ? (
          <TouchableOpacity
            onPress={() => navigateToProductDetails(selectedProduct.id)}
            style={styles.productDetailContainer}>
            <View style={styles.productImageContainer}>
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <Image
                  source={{
                    uri: `https://backend.souqna.net${selectedProduct.images[0].path}`,
                  }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.productImage, styles.noImagePlaceholder]}>
                  <Text>No Image</Text>
                </View>
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productTitle} numberOfLines={1}>
                {selectedProduct.name}
              </Text>
              <Text style={styles.productLocation}>
                {selectedProduct.location}
              </Text>
              <View style={styles.priceTagContainer}>
                <Text style={styles.priceTag}>
                  {selectedProduct.price} - USD
                </Text>
                {selectedProduct.condition != 2 ? (
                  <Text style={styles.conditionTag}>New</Text>
                ) : (
                  <Text style={styles.conditionTag}>Used</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProduct(null)}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
          showsUserLocation
          showsMyLocationButton={false}
          onRegionChangeComplete={newRegion => {
            if (
              !region ||
              Math.abs(newRegion.latitude - region.latitude) > 0.0001 ||
              Math.abs(newRegion.longitude - region.longitude) > 0.0001
            ) {
              setRegion(newRegion);
            }
          }}
          onMapReady={() => {
            // Only set initialMapLoadedRef to true if it wasn't already set
            if (!initialMapLoadedRef.current) {
              initialMapLoadedRef.current = true;

              if (userLocation && mapRef.current) {
                mapRef.current.animateToRegion({
                  ...userLocation,
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.09,
                });
              } else if (region && mapRef.current) {
                // Use current region if user location isn't available
                mapRef.current.animateToRegion(region);
              } else if (allProducts && allProducts.length > 0 && !region) {
                // Only set default region if no region is set yet
                setDefaultRegion();
              }
            }
          }}>
          {visibleProducts.map((product, index) => {
            const lat = parseFloat(product.lat);
            const long = parseFloat(product.long);

            if (isNaN(lat) || isNaN(long)) return null;

            return (
              <Marker
                key={'product-${index}'}
                coordinate={{
                  latitude: lat,
                  longitude: long,
                }}
                title={product.name || 'Product'}
                description={product.description || ''}
                onPress={() => handleMarkerPress(product)}>
                <View
                  style={{
                    backgroundColor: colors.lightgreen,
                    borderRadius: 4,
                    padding: 1,
                    width: 35,
                    height: 35,
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    ${/* {product.price} */}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    {formatPrice(product.price)}
                    {/* {product.price} */}
                  </Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={goToMyLocation}
          disabled={isLocationLoading}>
          <CurrentLocationSVG width={24} height={24} />
          {isLocationLoading && <View style={styles.loadingIndicator} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}