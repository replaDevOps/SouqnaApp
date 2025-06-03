// MapConfirmationScreen.js
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {mvs} from '../../util/metrices';
import {BackwardSVG} from '../../assets/svg';
import {colors} from '../../util/color';
import MapView, {Marker, Polygon} from 'react-native-maps';

const MapConfirmationScreen = ({
  onStepChange,
  onConfirm,
  mapRegion,
  markerPosition,
  onMarkerUpdate,
  selectedNeighborhood,
  hasManualSelection,
}) => {
  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    
    // If neighborhood is selected, check if the tap is within the neighborhood bounds
    if (selectedNeighborhood) {
      const isWithinBounds = isPointInPolygon(
        coordinate,
        selectedNeighborhood.coordinates,
      );
      
      if (!isWithinBounds) {
        Alert.alert(
          'Invalid Location',
          'Please select a location within the highlighted neighborhood area.',
        );
        return;
      }
    }
    
    onMarkerUpdate(coordinate);
  };

  const isPointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude;
      const yi = polygon[i].longitude;
      const xj = polygon[j].latitude;
      const yj = polygon[j].longitude;

      if (
        yi > point.longitude !== yj > point.longitude &&
        point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi
      ) {
        inside = !inside;
      }
    }
    return inside;
  };

  const handleConfirm = () => {
    if (!markerPosition) {
      Alert.alert('No Location Selected', 'Please tap on the map to select a location.');
      return;
    }
    onConfirm();
  };

  const handleBack = () => {
    if (hasManualSelection) {
      onStepChange('manual');
    } else {
      onStepChange('main');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <BackwardSVG width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Location</Text>
        <TouchableOpacity 
          onPress={handleConfirm}
          style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={mapRegion}
        onPress={handleMapPress}
        showsUserLocation={!hasManualSelection}
        showsMyLocationButton={false}>
        
        {selectedNeighborhood && (
          <Polygon
            coordinates={selectedNeighborhood.coordinates}
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeColor="rgba(255, 255, 0, 0.8)"
            strokeWidth={2}
          />
        )}
        
        {markerPosition && (
          <Marker 
            coordinate={markerPosition}
            title="Selected Location"
            description="Tap to move this marker"
          />
        )}
      </MapView>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          {selectedNeighborhood
            ? 'Tap within the highlighted area to place your marker'
            : 'Tap anywhere on the map to place your marker'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: mvs(20),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.black,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: mvs(15),
    paddingVertical: mvs(8),
    borderRadius: mvs(6),
  },
  confirmText: {
    fontSize: mvs(16),
    color: colors.white,
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: mvs(30),
    left: mvs(20),
    right: mvs(20),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: mvs(15),
    paddingVertical: mvs(10),
    borderRadius: mvs(8),
  },
  instructionText: {
    color: colors.white,
    fontSize: mvs(14),
    textAlign: 'center',
  },
});

export default MapConfirmationScreen;