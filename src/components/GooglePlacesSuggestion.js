import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {mvs} from '../util/metrices';
import {CloseSvg, SearchSVG} from '../assets/svg';
import {colors} from '../util/color';
import config from '../util/config';
import Geolocation from '@react-native-community/geolocation';
import CustomText from './CustomText';
import {useTranslation} from 'react-i18next';

const GOOGLE_PLACES_API_KEY = config.GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';

const GooglePlacesSuggestion = ({
  onPlaceSelected,
  initialValue = '',
  placeholder = 'Enter Location.....',
  showlivelocation = true,
}) => {
  const [text, setText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const suppressFetchRef = useRef(false);
  const textInputRef = useRef(null);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const {t} = useTranslation();
  const suggestionData = showlivelocation
    ? [{isCurrentLocation: true, key: 'current-location'}, ...suggestions]
    : suggestions;

  // const handleCurrentLocationPress = async () => {
  //   try {
  //     setIsFetchingLocation(true);
  //     let permissionResult;

  //     if (Platform.OS === 'android') {
  //       const fineLocationGranted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Location Permission',
  //           message: 'This app needs access to your location.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );

  //       if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         setIsFetchingLocation(false);
  //         Alert.alert(
  //           'Permission Denied',
  //           'Location permission is required to access your current location.',
  //         );
  //         return;
  //       }

  //       Geolocation.getCurrentPosition(
  //         position => {
  //           const {latitude, longitude} = position.coords;
  //           const lat = latitude.toString();
  //           const long = longitude.toString();

  //           fetch(
  //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_PLACES_API_KEY}`,
  //           )
  //             .then(res => res.json())
  //             .then(json => {
  //               const location =
  //                 json.results && json.results.length
  //                   ? json.results[0].formatted_address
  //                   : 'Current Location';

  //               onPlaceSelected({location, lat, long});
  //               setText(location);
  //               setSuggestions([]);
  //             })
  //             .finally(() => {
  //               setIsFetchingLocation(false);
  //             });
  //         },
  //         error => {
  //           setIsFetchingLocation(false);
  //           if (error.code === 1) {
  //             Alert.alert(
  //               'Permission Denied',
  //               'Location permission was denied.',
  //             );
  //           } else if (error.code === 2 || error.code === 3) {
  //             Alert.alert(
  //               'Location Unavailable',
  //               'Please ensure location services (GPS) are turned ON.',
  //               [
  //                 {text: 'Cancel', style: 'cancel'},
  //                 {
  //                   text: 'Open Settings',
  //                   onPress: () => Linking.openSettings(),
  //                 },
  //               ],
  //             );
  //           } else {
  //             console.log('Geo Error:', error);
  //             Alert.alert('Location Error', JSON.stringify(error));
  //           }
  //         },
  //         {
  //           enableHighAccuracy: true,
  //           timeout: 20000,
  //           maximumAge: 1000,
  //           distanceFilter: 0,
  //           forceRequestLocation: true,
  //           showLocationDialog: true,
  //         },
  //       );
  //     }
  //   } catch (err) {
  //     setIsFetchingLocation(false);
  //     console.warn(err);
  //   }
  // };

  const handleCurrentLocationPress = async () => {
    try {
      setIsFetchingLocation(true);

      // Request permission
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
            buttonNegative: t('Cancel'),
            buttonPositive: t('ok'),
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsFetchingLocation(false); // stop loading if permission is denied
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const lat = latitude.toString();
          const long = longitude.toString();

          // Call reverse geocoding API to get address
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_PLACES_API_KEY}`,
          )
            .then(res => res.json())
            .then(json => {
              const location =
                json.results && json.results.length
                  ? json.results[0].formatted_address
                  : 'Current Location';

              onPlaceSelected({location, lat, long});
              setText(location);
              setSuggestions([]);
            })
            .catch(error => {
              console.log('Reverse geocoding failed:', error);
            })
            .finally(() => {
              setIsFetchingLocation(false); // always stop loading
            });
        },
        error => {
          console.log('Geolocation error:', error);
          setIsFetchingLocation(false); // stop loading on geolocation error
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (err) {
      console.warn(err);
      setIsFetchingLocation(false); // stop loading on general error
    }
  };

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Skip fetch if selection just happened
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    let active = true;
    setLoading(true);
    const query = encodeURIComponent(text);
    fetch(
      `${AUTOCOMPLETE_URL}?key=${GOOGLE_PLACES_API_KEY}&input=${query}&language=en`,
    )
      .then(res => res.json())
      .then(json => {
        console.log('🧪 GOOGLE_PLACES_API_KEY:', GOOGLE_PLACES_API_KEY);
        console.log('Autocomplete Response:', JSON.stringify(json, null, 2)); // DEBUG
        if (!active) return;
        setSuggestions(json.status === 'OK' ? json.predictions : []);
      })
      .catch(() => active && setSuggestions([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [text]);

  const handleSelect = item => {
    // Prevent immediate refetch
    suppressFetchRef.current = true;
    setIsPlaceSelected(true);
    setText(item.description);
    setSuggestions([]);

    // After setting text, position cursor at beginning
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({
          selection: {start: 0, end: 0},
        });
      }
    }, 50);

    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_PLACES_API_KEY}&place_id=${item.place_id}&fields=geometry`,
    )
      .then(res => res.json())
      .then(json => {
        if (json.status === 'OK') {
          const {lat, lng} = json.result.geometry.location;
          onPlaceSelected({
            location: item.description,
            lat: String(lat),
            long: String(lng),
          });
        } else {
          onPlaceSelected({location: item.description, lat: '', long: ''});
        }
      })
      .catch(() =>
        onPlaceSelected({location: item.description, lat: '', long: ''}),
      );
  };

  const handleFocus = () => {
    // Reset the place selected flag when the user interacts with the input again
    setIsPlaceSelected(false);
  };

  console.log('🧪 GOOGLE_PLACES_API_KEY:', config);

  // In renderItem:
  const renderItem = ({item}) => {
    if (item.isCurrentLocation) {
      return (
        <TouchableOpacity
          style={styles.suggestionItem}
          onPress={handleCurrentLocationPress}>
          {isFetchingLocation ? (
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <CustomText
              style={[
                styles.description,
                {fontWeight: 'bold', marginVertical: 10, padding: 10},
              ]}>
              📍 Choose your current location
            </CustomText>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelect(item)}>
        <View style={styles.row}>
          <CustomText style={styles.description}>{item.description}</CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  {
    (text.length >= 0 /* or 1 */ || suggestions.length > 0) && (
      <FlatList
        data={suggestionData}
        keyExtractor={(item, index) =>
          item.place_id || item.key || index.toString()
        }
        renderItem={renderItem}
        style={styles.listView}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <View style={styles.leftButton}>
          <SearchSVG width={25} height={25} />
        </View>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder={t(placeholder)}
          placeholderTextColor={colors.grey}
          value={text}
          onChangeText={setText}
          onFocus={handleFocus}
          // Only apply selection when a place is selected, not during normal typing
          selection={isPlaceSelected ? {start: 0, end: 0} : null}
        />
        {text.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setText('');
              setSuggestions([]);
            }}>
            <CloseSvg width={16} height={16} />
          </TouchableOpacity>
        )}
      </View>

      {/* Show 📍 Use my location when input is empty */}
      {text.length < 1 && showlivelocation && (
        <TouchableOpacity
          style={styles.useMyLocationButton}
          onPress={handleCurrentLocationPress}>
          {isFetchingLocation ? (
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <CustomText style={styles.useMyLocationText}>
              📍 Use your current location
            </CustomText>
          )}
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator style={{marginTop: mvs(5)}} />}
      {/* {suggestions.length > 0 && ( */}
      {(text.length >= 2 || suggestions.length > 0) && (
        <FlatList
          data={suggestionData}
          keyExtractor={(item, index) =>
            item.place_id || item.key || index.toString()
          }
          // keyExtractor={item => item.place_id}
          renderItem={renderItem}
          style={styles.listView}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 50,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(5),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(5),
  },
  leftButton: {
    height: mvs(40),
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: colors.grey,
    paddingRight: mvs(10),
  },
  textInput: {
    flex: 1,
    height: mvs(40),
    marginLeft: mvs(5),
    fontSize: mvs(16),
    textAlign: 'left',
    color: colors.black,
  },
  listView: {
    maxHeight: mvs(250),
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    borderRadius: mvs(5),
    marginTop: mvs(5),
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clearText: {
    fontSize: mvs(18),
    marginLeft: mvs(10),
    color: colors.black,
  },
  suggestionItem: {
    width: '100%',
  },
  row: {
    backgroundColor: colors.white,
    padding: mvs(13),
    flexDirection: 'row',
  },
  description: {
    fontSize: mvs(14),
    color: colors.black,
  },
  useMyLocationButton: {
    marginTop: mvs(8),
    padding: mvs(12),
    backgroundColor: colors.white,
    borderWidth: 0.2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },

  useMyLocationText: {
    fontSize: mvs(14),
    fontWeight: '600',
    color: colors.black,
  },
});

export default GooglePlacesSuggestion;
