import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {mvs} from '../util/metrices';
import {CloseSvg, SearchSVG} from '../assets/svg';
import {colors} from '../util/color';
import config from '../util/config';

const GOOGLE_PLACES_API_KEY = config.GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';

const GooglePlacesSuggestion = ({
  onPlaceSelected,
  initialValue = '',
  placeholder = 'Enter Location.....',
}) => {
  const [text, setText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const suppressFetchRef = useRef(false);
  const textInputRef = useRef(null);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);

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
          selection: { start: 0, end: 0 }
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

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelect(item)}>
      <View style={styles.row}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <View style={styles.leftButton}>
          <SearchSVG width={25} height={25} />
        </View>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={colors.grey}
          value={text}
          onChangeText={setText}
          onFocus={handleFocus}
          // Only apply selection when a place is selected, not during normal typing
          selection={isPlaceSelected ? { start: 0, end: 0 } : null}
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
      {loading && <ActivityIndicator style={{marginTop: mvs(5)}} />}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={item => item.place_id}
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
});

export default GooglePlacesSuggestion;