import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation, useRoute } from '@react-navigation/native';
import isEqual from 'lodash.isequal';

import MainHeader from '../../../components/Headers/MainHeader';
import {
  BarsSVG,
  CurrentLocationSVG,
  ForwardSVG,
  NoneSVG,
} from '../../../assets/svg';
import { mvs } from '../../../util/metrices';
import styles from './styles';
import { useSelector } from 'react-redux';
import { colors } from '../../../util/color';

export default function MapScreen() {
  const route = useRoute();
  const { allProducts } = route.params;

  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedProductsGroup, setSelectedProductsGroup] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [groupedProductsByLocation, setGroupedProductsByLocation] = useState({});

  // Group products by location
  const groupProductsByLocation = useCallback(() => {
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

  // Close dropdown when clicking outside
  const closeDropdownOnOutsidePress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  // Add this reference for map
  const mapRef = useRef(null);
  const locationRetryCount = useRef(0);
  const initialMapLoadedRef = useRef(false);
  const initialLocationRequestedRef = useRef(false);
  const maxRetries = 3;

  const categories = useSelector(state => state.category.categories);

  // Process products based on visible region and active category
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
  }, [region, allProducts, activeCategory]);

  // Initialize grouped products when allProducts changes
  useEffect(() => {
    const grouped = groupProductsByLocation();
    setGroupedProductsByLocation(grouped);
  }, [groupProductsByLocation]);

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

        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        };

        setUserLocation({ latitude, longitude });
        setRegion(newRegion);

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion);
        }
      },
      error => {
        // Error handling code (unchanged)
        setIsLocationLoading(false);
        if (error.code === 3) {
          if (locationRetryCount.current < maxRetries) {
            // Retry logic
            locationRetryCount.current += 1;
            setTimeout(() => {
              getCurrentLocation();
            }, 1000);
          } else {
            // Set default region if location fails after retries
            Alert.alert(
              'Location Timeout',
              'Unable to get your current location. Please check your device location.',
            );
            setDefaultRegion();
          }
        } else {
          // Handle other location errors
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
      setDefaultRegion();
    }
  }, [getCurrentLocation, setDefaultRegion]);

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
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      locationProvider: 'auto',
    });

    requestLocationPermission();

    return () => {
      initialMapLoadedRef.current = false;
      initialLocationRequestedRef.current = false;
    };
  }, []);

  const formatPrice = price => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return price.toString();
    }
  };

  const navigateToProductDetails = productId => {
    navigation.navigate('ProductDetail', { productId });
    console.log('Product ID: ', productId);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Modified to accept locationKey instead of a single product
  const handleMarkerPress = (locationKey) => {
    if (groupedProductsByLocation[locationKey]) {
      setSelectedProductsGroup(groupedProductsByLocation[locationKey]);
    }
  };

  const goToMyLocation = () => {
    locationRetryCount.current = 0;
    getCurrentLocation();
  };

  const RadioButton = ({ selected }) => {
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
          <Text style={{ fontSize: mvs(18), fontWeight: 'bold' }}>
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
              {
                selectedProductsGroup.length > 1 && (

              <Text style={styles.productGroupTitle}>
                {selectedProductsGroup.length} Product{selectedProductsGroup.length > 1 ? 's' : ''} Available
              </Text>
                )
              }
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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
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
                        <Text>No Image</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.productLocation} numberOfLines={1} ellipsizeMode="tail">
                      {item.location}
                    </Text>
                    <View style={styles.priceTagContainer}>
                      <Text style={styles.priceTag}>
                        {item.price} - USD
                      </Text>
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
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: mvs(15), fontWeight: '400' }}>
              In this region:
            </Text>
            <Text style={{ fontSize: mvs(22), fontWeight: 'bold' }}>
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
            if (!initialMapLoadedRef.current) {
              initialMapLoadedRef.current = true;

              if (userLocation && mapRef.current) {
                mapRef.current.animateToRegion({
                  ...userLocation,
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.09,
                });
              } else if (region && mapRef.current) {
                mapRef.current.animateToRegion(region);
              } else if (allProducts && allProducts.length > 0 && !region) {
                setDefaultRegion();
              }
            }
          }}>

          {/* Render markers for grouped products */}
          {Object.entries(groupedProductsByLocation).map(([locationKey, products]) => {
            const [lat, long] = locationKey.split(',').map(parseFloat);

            // Skip invalid coordinates
            if (isNaN(lat) || isNaN(long)) return null;

            // Filter products based on active category if needed
            let displayProducts = products;
            if (activeCategory) {
              displayProducts = products.filter(
                product => product.category && product.category.name === activeCategory
              );
              if (displayProducts.length === 0) return null; // Skip if no products match the category
            }

            // Calculate average price or use first product price as indicator
            const averagePrice = displayProducts.reduce((sum, product) => sum + parseFloat(product.price), 0) / displayProducts.length;

            return (
              <Marker
                key={locationKey}
                coordinate={{
                  latitude: lat,
                  longitude: long,
                }}
                title={`${displayProducts.length} product${displayProducts.length > 1 ? 's' : ''}`}
                description={`${displayProducts.length} item${displayProducts.length > 1 ? 's' : ''} available at this location`}
                onPress={() => handleMarkerPress(locationKey)}>
                <View
                  style={{
                    backgroundColor: colors.lightgreen,
                    borderRadius: 4,
                    padding: 1,
                    width: displayProducts.length > 1 ? 45 : 35,
                    height: displayProducts.length > 1 ? 45 : 35,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: displayProducts.length > 1 ? 10 : 12,
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    {formatPrice(averagePrice)}
                  </Text>
                  {displayProducts.length > 1 && (
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#fff',
                        textAlign: 'center',
                      }}>
                      {displayProducts.length} items
                    </Text>
                  )}
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