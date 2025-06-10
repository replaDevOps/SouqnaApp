import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Linking,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { colors } from '../../util/color';
import config from '../../util/config';
import Geolocation from '@react-native-community/geolocation';
import GooglePlacesSuggestion from '../GooglePlacesSuggestion';
import i18n from '../../i18n/i18n';
import { useTranslation } from 'react-i18next';

// For map functionality
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CurrentLocationSVG } from '../../assets/svg';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');
const GOOGLE_PLACES_API_KEY = config.GOOGLE_PLACES_API_KEY;

const LocationModal = ({ visible, onLocationSelected, onClose }) => {
  const { t } = useTranslation();

  // UI state
  const [currentView, setCurrentView] = useState('map');

  // Location state
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 36.2021, // Damascus coordinates as default
    longitude: 37.2152,
    address: '',
    manualNote: '',
  });

  // UI state
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapRef = useRef(null);

  // Auto-load current location when modal opens
  useEffect(() => {
    if (visible) {
      // Auto-find location when modal opens
      handleFindMyLocation();
    }
  }, [visible]);

  // Get current location using GPS
  const handleFindMyLocation = async () => {
    try {
      setIsLoadingLocation(true);

      // Request permission
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      }

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t('locationPermissionTitle'),
            message: t('locationPermissionMessage'),
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsLoadingLocation(false);
          Alert.alert(t('permissionDenied'), t('locationPermissionMessage'));
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const newLocation = {
            ...selectedLocation,
            latitude,
            longitude,
          };

          setSelectedLocation(newLocation);
          setIsLoadingLocation(false);

          // Center map on new location with street level zoom
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.005, // Street level zoom
              longitudeDelta: 0.005,
            }, 1000);
          }

          // Get address for this location
          reverseGeocode(latitude, longitude);
        },
        error => {
          console.log('Geolocation error:', error);
          setIsLoadingLocation(false);

          if (error.code === 1) {
            Alert.alert(t('permissionDenied'), t('locationPermissionMessage'));
          } else if (error.code === 2 || error.code === 3) {
            Alert.alert(
              t('locationUnavailable'),
              t('enableGPS'),
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: t('openSettings'),
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
        },
      );
    } catch (err) {
      console.warn(err);
      setIsLoadingLocation(false);
    }
  };

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (latitude, longitude) => {
    try {
      setIsLoadingAddress(true);
      const currentLanguage = i18n.language;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}&language=${currentLanguage === 'ar' ? 'ar' : 'en'}`,
      );
      const json = await response.json();

      if (json.status === 'OK' && json.results && json.results.length > 0) {
        const address = json.results[0].formatted_address;
        setSelectedLocation(prev => ({
          ...prev,
          address,
        }));
      } else {
        setSelectedLocation(prev => ({
          ...prev,
          address: t('unknownLocation'),
        }));
      }
    } catch (error) {
      console.log('Reverse geocoding failed:', error);
      setSelectedLocation(prev => ({
        ...prev,
        address: t('unknownLocation'),
      }));
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Handle map tap
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newLocation = {
      ...selectedLocation,
      latitude,
      longitude,
    };
    setSelectedLocation(newLocation);
    reverseGeocode(latitude, longitude);
  };

  // Handle marker drag
  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newLocation = {
      ...selectedLocation,
      latitude,
      longitude,
    };
    setSelectedLocation(newLocation);
    reverseGeocode(latitude, longitude);
  };

  // Handle place selection from search
  const handlePlaceSelected = (place) => {
    if (place.lat && place.long) {
      const latitude = parseFloat(place.lat);
      const longitude = parseFloat(place.long);

      const newLocation = {
        ...selectedLocation,
        latitude,
        longitude,
        address: place.location,
      };

      setSelectedLocation(newLocation);
      setSearchQuery(place.location);

      // Center map on selected place with street level zoom
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    }
    setShowSuggestions(false);
  };

  // Handle final location confirmation
  const handleConfirmLocation = () => {
    if (!selectedLocation.latitude || !selectedLocation.longitude) {
      Alert.alert('Error', t('selectLocationFirst'));
      return;
    }

    const finalLocation = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedLocation.address || t('unknownLocation'),
      location: selectedLocation.address || t('unknownLocation'),
      manualNote: manualInput.trim(),
      coordinates: `${selectedLocation.latitude},${selectedLocation.longitude}`,
      lat: selectedLocation.latitude,
      long: selectedLocation.longitude,
    };

    onLocationSelected(finalLocation);
    onClose();
  };

  // Render the search bar (similar to Google Maps)
  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>

      {/* {showSuggestions && ( */}
      <View style={styles.searchBarContainer}>
        <GooglePlacesSuggestion
          onPlaceSelected={handlePlaceSelected}
          // placeholder=""
          initialValue={searchQuery}
          showlivelocation={false}
        />
      </View>
      {/* )} */}
    </View>
  );

  // Render floating action buttons
  const renderFloatingButtons = () => (
    <View style={styles.floatingButtons}>
      {/* <TouchableOpacity
        style={styles.layersButton}
        onPress={() => {
          // Map layers functionality
          Alert.alert('Map Layers', 'Map layers feature coming soon!');
        }}
      >
        <Text style={styles.layersIcon}>🗂️</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleFindMyLocation}
        disabled={isLoadingLocation}
      >
        {isLoadingLocation ? (
          <ActivityIndicator size="small" color={colors.lightgreen} />
        ) : (
          <CurrentLocationSVG width={24} height={24} color={colors.lightgreen} />
        )}
      </TouchableOpacity>
    </View>
  );

  // Render map view
  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {renderSearchBar()}

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.005, // Street level zoom
          longitudeDelta: 0.005,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapType="standard"
        followsUserLocation={false}
      >
        <Marker
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          title={t('selectedLocation')}
          description={selectedLocation.address}
        />
      </MapView>

      {renderFloatingButtons()}

      {/* Location info overlay */}
      <View style={styles.locationInfo}>
        <Text style={styles.dragToSelectText}>{t('tapOrDragToSelect')}</Text>
        <View style={styles.selectedLocationContainer}>
          <Text style={styles.selectedLocationLabel}>{t('selectedLocation')}</Text>
          {isLoadingAddress ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.black} />
              <Text style={styles.loadingText}>{t('loadingAddress')}</Text>
            </View>
          ) : (
            <Text style={styles.selectedLocationText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {selectedLocation.address || t('unknownLocation')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  // Render manual entry view
  const renderManualView = () => (
    <ScrollView style={styles.manualContainer} contentContainerStyle={styles.manualContent}>
      <View style={styles.manualSection}>
        <Text style={styles.manualTitle}>{t('manualEntry')}</Text>
        <Text style={styles.manualDescription}>
          {t('noInternetDesc')}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('manualNote')}</Text>
          <TextInput
            style={styles.manualInput}
            placeholder={t('manualNotePlaceholder')}
            placeholderTextColor={colors.grey}
            value={manualInput}
            onChangeText={setManualInput}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {selectedLocation.address && (
          <View style={styles.currentLocationContainer}>
            <Text style={styles.currentLocationLabel}>{t('selectedLocation')}</Text>
            <Text style={styles.currentLocationText}>{selectedLocation.address}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // Render footer with action buttons
  const renderFooter = () => (
    <View style={styles.footer}>
      {/* <TouchableOpacity
        onPress={() => setCurrentView(currentView === 'map' ? 'manual' : 'map')}
        style={styles.toggleViewButton}>
        <Text style={styles.toggleViewText}>
          {currentView === 'map' ? '✏️ Manual Entry' : '🗺️ Map View'}
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={handleConfirmLocation}
        style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>{t('confirm')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {currentView === 'map' ? renderMapView() : renderManualView()}
        </View>
        {renderFooter()}
      </SafeAreaView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={styles.container}>{renderCurrentScreen()}</View>
    </Modal>
  );
};


export default LocationModal;
