// MainSelectionScreen.js
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {mvs} from '../../util/metrices';
// import {CloseSvg, SearchSVG, CurrentLocationSVG} from '../../assets/svg';
import {  CloseSvg, CurrentLocationSVG, SearchSVG } from '../../assets/svg';
import {colors} from '../../util/color';
import Geolocation from '@react-native-community/geolocation';

const MainSelectionScreen = ({
  onClose,
  onStepChange,
  onMapRegionUpdate,
  onMarkerUpdate,
  onResetData,
}) => {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleCurrentLocationPress = async () => {
    try {
      setIsFetchingLocation(true);

      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      }

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsFetchingLocation(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const region = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          onMapRegionUpdate(region);
          onMarkerUpdate({latitude, longitude});
          onStepChange('map');
          setIsFetchingLocation(false);
        },
        error => {
          console.log('Geolocation error:', error);
          setIsFetchingLocation(false);
          Alert.alert('Error', 'Unable to get current location');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (err) {
      console.warn(err);
      setIsFetchingLocation(false);
    }
  };

  const handleManualLocationPress = () => {
    onResetData();
    onStepChange('manual');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <CloseSvg width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Location</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleCurrentLocationPress}
          disabled={isFetchingLocation}>
          {isFetchingLocation ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <CurrentLocationSVG width={20} height={20} />
              <Text style={styles.buttonText}>Choose Live Location</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.locationButton, styles.manualButton]}
          onPress={handleManualLocationPress}>
          <SearchSVG width={20} height={20} />
          <Text style={[styles.buttonText, {color: colors.black}]}>
            Enter Location Manually
          </Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.black,
  },
  buttonContainer: {
    padding: mvs(20),
    gap: mvs(15),
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightgreen,
    paddingVertical: mvs(15),
    paddingHorizontal: mvs(20),
    borderRadius: mvs(10),
    gap: mvs(10),
  },
  manualButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightgreen,
  },
  buttonText: {
    fontSize: mvs(16),
    fontWeight: '600',
    color: colors.white,
  },
});

export default MainSelectionScreen;