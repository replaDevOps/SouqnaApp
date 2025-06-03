// LocationModal.js (Modal Controller Component)
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../../util/color';
import MainSelectionScreen from './MainSelectionScreen';
import ManualLocationScreen from './ManualLocationScreen';
import MapConfirmationScreen from './MapConfirmationScreen';

const LocationModal = ({onLocationSelected, onClose}) => {
  const [currentStep, setCurrentStep] = useState('main'); // main, manual, map
  const [locationData, setLocationData] = useState({
    country: null,
    province: null,
    city: null,
    neighborhood: null,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 39.9158,
    longitude: 32.8591,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleLocationDataUpdate = (newData) => {
    setLocationData({...locationData, ...newData});
  };

  const handleMapRegionUpdate = (region) => {
    setMapRegion(region);
  };

  const handleMarkerUpdate = (position) => {
    setMarkerPosition(position);
  };

  const resetLocationData = () => {
    setLocationData({
      country: null,
      province: null,
      city: null,
      neighborhood: null,
    });
  };

  const handleLocationConfirm = () => {
    if (markerPosition) {
      let locationName = '';
      if (locationData.neighborhood) {
        locationName = `${locationData.neighborhood.name}, ${locationData.city.name}, ${locationData.province.name}, ${locationData.country.name}`;
      } else {
        locationName = 'Selected Location';
      }
      
      onLocationSelected({
        location: locationName,
        lat: markerPosition.latitude.toString(),
        long: markerPosition.longitude.toString(),
      });
    }
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 'main':
        return (
          <MainSelectionScreen
            onClose={onClose}
            onStepChange={handleStepChange}
            onMapRegionUpdate={handleMapRegionUpdate}
            onMarkerUpdate={handleMarkerUpdate}
            onResetData={resetLocationData}
          />
        );
      case 'manual':
        return (
          <ManualLocationScreen
            onStepChange={handleStepChange}
            locationData={locationData}
            onLocationDataUpdate={handleLocationDataUpdate}
            onMapRegionUpdate={handleMapRegionUpdate}
            onMarkerUpdate={handleMarkerUpdate}
          />
        );
      case 'map':
        return (
          <MapConfirmationScreen
            onStepChange={handleStepChange}
            onConfirm={handleLocationConfirm}
            mapRegion={mapRegion}
            markerPosition={markerPosition}
            onMarkerUpdate={handleMarkerUpdate}
            selectedNeighborhood={locationData.neighborhood}
            hasManualSelection={!!locationData.neighborhood}
          />
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderCurrentScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default LocationModal;