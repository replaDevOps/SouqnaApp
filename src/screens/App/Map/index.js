import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, {
    PROVIDER_GOOGLE,
    Marker,
    Circle
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation, useRoute } from '@react-navigation/native';
import isEqual from 'lodash.isequal';

import MainHeader from '../../../components/Headers/MainHeader';
import { CurrentLocationSVG } from '../../../assets/svg';
import { mvs } from '../../../util/metrices';
import styles from './styles';



export default function MapScreen() {
    const route = useRoute();
    const { allProducts } = route.params;
    
    const navigation = useNavigation();
    const [region, setRegion] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const mapRef = useRef(null);
    const locationRetryCount = useRef(0);
    const initialMapLoadedRef = useRef(false);
    const maxRetries = 3;

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

    // Update visible products whenever region or allProducts change
    useEffect(() => {
        if (region && allProducts && allProducts.length > 0) {
            const filtered = allProducts.filter(product =>
                isProductInVisibleRegion(product, region)
            );
            
            if (!isEqual(filtered, visibleProducts)) {
                setVisibleProducts(filtered);
            }
        }
    }, [region, allProducts]);

    useEffect(() => {
        Geolocation.setRNConfiguration({
            skipPermissionRequests: false,
            authorizationLevel: 'whenInUse',
            locationProvider: 'auto'
        });

        requestLocationPermission();

        return () => {
            initialMapLoadedRef.current = false;
        };
    }, []);

    const requestLocationPermission = async () => {
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
                'Location permission is required to show your current location on the map.'
            );
            
            // Set a default region to show some products initially
            setDefaultRegion();
        }
    };
    
    const setDefaultRegion = () => {
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
    };

    const getCurrentLocation = () => {
        if (isLocationLoading) return;

        setIsLocationLoading(true);

        Geolocation.getCurrentPosition(
            (position) => {
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
            (error) => {
                setIsLocationLoading(false);

                if (error.code === 3) {
                    if (locationRetryCount.current < maxRetries) {
                        locationRetryCount.current += 1;

                        setTimeout(() => {
                            Geolocation.getCurrentPosition(
                                (position) => {
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
                                (retryError) => {
                                    if (locationRetryCount.current >= maxRetries) {
                                        Alert.alert(
                                            'Location Error',
                                            'Unable to get your location after several attempts. Please check your device settings and try again.',
                                            [
                                                { text: 'OK' },
                                                {
                                                    text: 'Open Settings',
                                                    onPress: () => {
                                                        // Optional: Link to open settings
                                                    }
                                                }
                                            ]
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
                                    maximumAge: 60000
                                }
                            );
                        }, 1000);
                    } else {
                        Alert.alert(
                            'Location Timeout',
                            'Unable to get your current location. Please check your device location.',
                            [
                                { text: 'OK' },
                                {
                                    text: 'Try Again',
                                    onPress: () => {
                                        locationRetryCount.current = 0;
                                        getCurrentLocation();
                                    }
                                }
                            ]
                        );
                        // Set default region if location fails
                        setDefaultRegion();
                    }
                } else if (error.code === 1) {
                    Alert.alert(
                        'Location Access Denied',
                        'Please enable location services in your device settings to use this feature.'
                    );
                    // Set default region if location is denied
                    setDefaultRegion();
                } else if (error.code === 2) {
                    Alert.alert(
                        'Location Unavailable',
                        'Your current location is unavailable. You might be in an area with poor GPS reception.'
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
                forceRequestLocation: true
            }
        );
    };

 const navigateToProductDetails = productId => {
    navigation.navigate('ProductDetail', {productId});
    console.log('Product ID: ', productId);
  };

    const handleMarkerPress = (product) => {
        setSelectedProduct(product);
    };

    const goToMyLocation = () => {
        locationRetryCount.current = 0;
        getCurrentLocation();
    };

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader showBackIcon={true} title="Map" />

            <View style={styles.BottomContainer}>
                {selectedProduct ?
                    <TouchableOpacity 
                    onPress={()=> navigateToProductDetails(selectedProduct.id)}
                    style={styles.productDetailContainer}>
                        <View style={styles.productImageContainer}>
                            {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                <Image
                                    source={{uri: `https://backend.souqna.net${selectedProduct.images[0].path}`}}
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
                            <Text style={styles.productTitle} numberOfLines={1}>{selectedProduct.name}</Text>
                            <Text style={styles.productLocation}>{selectedProduct.location}</Text>
                            <View style={styles.priceTagContainer}>
                                <Text style={styles.priceTag}>{selectedProduct.price} - USD</Text>
                                {
                                    selectedProduct.condition != 2 ?
                                    <Text style={styles.conditionTag}>New</Text>
                                    :
                                    <Text style={styles.conditionTag}>Used</Text>
                                }
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedProduct(null)}
                        >
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    :
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: mvs(15), fontWeight: '400' }}>In this region:</Text>
                        <Text style={{ fontSize: mvs(22), fontWeight: 'bold' }}>{visibleProducts.length} ads</Text>
                    </View>
                }
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    showsUserLocation
                    showsMyLocationButton={false}
                    onRegionChangeComplete={(newRegion) => {
                        if (!region || 
                            Math.abs(newRegion.latitude - region.latitude) > 0.0001 ||
                            Math.abs(newRegion.longitude - region.longitude) > 0.0001
                        ) {
                            setRegion(newRegion);
                        }
                    }}
                    onMapReady={() => {
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
                        } else if (allProducts && allProducts.length > 0) {
                            // If no region set yet, set default from products
                            setDefaultRegion();
                        }
                    }}
                >
                    {visibleProducts.map((product, index) => {
                        const lat = parseFloat(product.lat);
                        const long = parseFloat(product.long);
                        
                        if (isNaN(lat) || isNaN(long)) return null;
                        
                        return (
                            <Marker
                                key={`product-${index}`}
                                coordinate={{
                                    latitude: lat,
                                    longitude: long,
                                }}
                                title={product.name || "Product"}
                                description={product.description || ""}
                                onPress={() => handleMarkerPress(product)}
                            />
                        );
                    })}
                </MapView>

                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={goToMyLocation}
                    disabled={isLocationLoading}
                >
                    <CurrentLocationSVG width={24} height={24} />
                    {isLocationLoading && (
                        <View style={styles.loadingIndicator} />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}