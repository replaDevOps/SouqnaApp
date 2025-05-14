import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/Headers/MainHeader';
import GooglePlacesSuggestion from '../../../components/GooglePlacesSuggestion';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { mvs } from '../../../util/metrices';
import { colors } from '../../../util/color';
import { CurrentLocationSVG } from '../../../assets/svg';
import { useRoute } from '@react-navigation/native';
import isEqual from 'lodash.isequal';

export default function MapScreen() {
    const route = useRoute();
    const { allProducts } = route.params;

    console.log('[MapScreen] Received allProducts:', allProducts.lat);
    const [region, setRegion] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const mapRef = useRef(null);
    const locationRetryCount = useRef(0);
    const maxRetries = 3;
    const initialMapLoadedRef = useRef(false);

    const isProductInVisibleRegion = (product, region) => {
        const lat = parseFloat(product.lat);
        const lng = parseFloat(product.long);

        const latMin = region.latitude - region.latitudeDelta / 2;
        const latMax = region.latitude + region.latitudeDelta / 2;
        const lngMin = region.longitude - region.longitudeDelta / 2;
        const lngMax = region.longitude + region.longitudeDelta / 2;

        return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
    };

    useEffect(() => {
        // Initialize location configuration
        Geolocation.setRNConfiguration({
            skipPermissionRequests: false,
            authorizationLevel: 'whenInUse',
            locationProvider: 'auto'
        });

        requestLocationPermission();

        return () => {
            // Clean up any resources if needed
            initialMapLoadedRef.current = false;
        };
    }, []);

    const requestLocationPermission = async () => {
        const permission = Platform.OS === 'ios'
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
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                };

                setUserLocation({
                    latitude,
                    longitude,
                });

                setRegion(newRegion);

                if (mapRef.current) {
                    mapRef.current.animateToRegion(newRegion);
                }
            },
            (error) => {
                setIsLocationLoading(false);

                // Check for specific error cases
                if (error.code === 3) { // TIMEOUT
                    if (locationRetryCount.current < maxRetries) {
                        locationRetryCount.current += 1;

                        // Try with different settings on retry
                        setTimeout(() => {
                            Geolocation.getCurrentPosition(
                                (position) => {
                                    locationRetryCount.current = 0;
                                    const { latitude, longitude } = position.coords;

                                    const newRegion = {
                                        latitude,
                                        longitude,
                                        latitudeDelta: 0.015,
                                        longitudeDelta: 0.0121,
                                    };

                                    setUserLocation({
                                        latitude,
                                        longitude,
                                    });

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
                                                        // Add code to open location settings if needed
                                                    }
                                                }
                                            ]
                                        );
                                    } else {
                                        getCurrentLocation(); // Try again
                                    }
                                },
                                // Use different settings for retry
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
                            'Unable to get your current location. Please check you device location',
                            [
                                { text: 'OK' },
                                {
                                    text: 'Try Again', onPress: () => {
                                        locationRetryCount.current = 0;
                                        getCurrentLocation();
                                    }
                                }
                            ]
                        );
                    }
                } else if (error.code === 1) { // PERMISSION_DENIED
                    Alert.alert(
                        'Location Access Denied',
                        'Please enable location services in your device settings to use this feature.'
                    );
                } else if (error.code === 2) { // POSITION_UNAVAILABLE
                    Alert.alert(
                        'Location Unavailable',
                        'Your current location is unavailable. You might be in an area with poor GPS reception.'
                    );
                } else {
                    Alert.alert('Error', 'Unable to get your current location.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 1000,
                maximumAge: 10000,
                forceRequestLocation: true // Force location request
            }
        );
    };

   

    const goToMyLocation = () => {
        locationRetryCount.current = 0;
        getCurrentLocation();
    };

    return (
        <SafeAreaView style={styles.container}>
            <MainHeader title={"Map"} />

            {/* <View style={styles.searchContainer}>
                <GooglePlacesSuggestion
                    placeholder="Search location"
                    onPlaceSelected={handlePlaceSelected}
                />
            </View> */}

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    showsMyLocationButton={false} // Disable default button, use custom one

                    onRegionChangeComplete={(newRegion) => {
                        if (
                            Math.abs(newRegion.latitude - region?.latitude) > 0.0001 ||
                            Math.abs(newRegion.longitude - region?.longitude) > 0.0001
                        ) {
                            setRegion(newRegion);
                            const filtered = allProducts.filter(product =>
                                isProductInVisibleRegion(product, newRegion)
                            );
                            if (!isEqual(filtered, visibleProducts)) {
                                setVisibleProducts(filtered);
                            }
                        }
                    }}

                    onMapReady={() => {
                        initialMapLoadedRef.current = true;
                        // Ensure we focus on user location once map is ready if it's available
                        if (userLocation && mapRef.current) {
                            mapRef.current.animateToRegion({
                                ...userLocation,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                            });
                        }
                    }}
                >
                    {userLocation && (
                        <Circle
                            center={userLocation}
                            radius={300}
                            fillColor="rgba(0, 150, 255, 0.2)"
                            strokeColor="rgba(0, 150, 255, 0.5)"
                        />
                    )}
                    {visibleProducts.map((product, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: parseFloat(product.lat),
                                longitude: parseFloat(product.long),
                            }}
                            title={product.name || "Product"}
                            description={product.description || ""}
                        />
                    ))}
                   
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    searchContainer: {
        padding: mvs(10),
        zIndex: 10,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    myLocationButton: {
        position: 'absolute',
        bottom: mvs(20),
        right: mvs(20),
        backgroundColor: colors.white,
        width: mvs(48),
        height: mvs(48),
        borderRadius: mvs(24),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    loadingIndicator: {
        position: 'absolute',
        width: mvs(48),
        height: mvs(48),
        borderRadius: mvs(24),
        borderWidth: 2,
        borderColor: colors.primary,
        borderTopColor: 'transparent',
        backgroundColor: 'transparent',
        transform: [{ rotate: '45deg' }],
        opacity: 0.7,
    },
});