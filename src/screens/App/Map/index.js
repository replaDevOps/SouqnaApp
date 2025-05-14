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
import { useRoute } from '@react-navigation/native';
import isEqual from 'lodash.isequal';

import MainHeader from '../../../components/Headers/MainHeader';
import { CurrentLocationSVG } from '../../../assets/svg';
import { colors } from '../../../util/color';
import { mvs } from '../../../util/metrices';

export default function MapScreen() {
    const route = useRoute();
    const { allProducts } = route.params;

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
        const lat = parseFloat(product.lat);
        const lng = parseFloat(product.long);

        const latMin = region.latitude - region.latitudeDelta / 2;
        const latMax = region.latitude + region.latitudeDelta / 2;
        const lngMin = region.longitude - region.longitudeDelta / 2;
        const lngMax = region.longitude + region.longitudeDelta / 2;

        return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
    };

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
                    }
                } else if (error.code === 1) {
                    Alert.alert(
                        'Location Access Denied',
                        'Please enable location services in your device settings to use this feature.'
                    );
                } else if (error.code === 2) {
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
                forceRequestLocation: true
            }
        );
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
            <MainHeader title="Map" />

            {/* Uncomment if search is needed later */}
            <View style={styles.BottomContainer}>
                {selectedProduct ?
                    <View style={styles.productDetailContainer}>
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
                                    selectedProduct.condition !=2 ?
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
                    </View>
                    :
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: mvs(15), fontWeight: '400' }}>In this region:</Text>
                        <Text style={{ fontSize: mvs(22), fontWeight: 'bold' }}>1- {visibleProducts.length} ads</Text>
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

                        if (userLocation && mapRef.current) {
                            mapRef.current.animateToRegion({
                                ...userLocation,
                                latitudeDelta: 0.09,
                                longitulongitudeDelta: 0.09,
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
                            onPress={() => handleMarkerPress(product)}

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
    BottomContainer: {
        borderTopColor: colors.grey,
        borderTopWidth: 1,
        position: 'absolute',
        padding: mvs(8),
        bottom: 0,
        backgroundColor: '#fff',
        width: '100%',
        zIndex: 50,
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
        Top: mvs(40),
        right: mvs(7),
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
    }, productDetailContainer: {
        
        backgroundColor: colors.white,
        // borderRadius: mvs(10),
        flexDirection: 'row',
        paddingVertical: mvs(5),
        paddingHorizontal: mvs(5),
       
       
    },
    productImageContainer: {
        width: mvs(80),
        height: mvs(80),
        borderRadius: mvs(8),
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    noImagePlaceholder: {
        backgroundColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
        marginLeft: mvs(10),
        justifyContent: 'space-between',
    },
    productTitle: {
        fontSize: mvs(16),
        fontWeight: 'bold',
        color: colors.black,
    },
    productLocation: {
        fontSize: mvs(14),
        color: colors.darkGrey,
    },
    priceTagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceTag: {
        fontSize: mvs(18),
        fontWeight: 'bold',
        color: colors.primary,
    },
    conditionTag: {
        fontSize: mvs(12),
        color: colors.darkGrey,
        backgroundColor: colors.lightGrey,
        paddingHorizontal: mvs(6),
        paddingVertical: mvs(2),
        borderRadius: mvs(4),
    },
    closeButton: {
        position: 'absolute',
        top: mvs(5),
        right: mvs(5),
        width: mvs(24),
        height: mvs(24),
        borderRadius: mvs(12),
        backgroundColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: mvs(16),
        fontWeight: 'bold',
        color: colors.darkGrey,
    }
});