// ManualLocationScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { mvs } from '../../util/metrices';
import { BackwardSVG, SearchSVG } from '../../assets/svg';
import { colors } from '../../util/color';
import config from '../../util/config';

const GOOGLE_PLACES_API_KEY = config.GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

// Complete list of countries with codes
const ALL_COUNTRIES = [
  { name: "Afghanistan", code: "AF" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "Andorra", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Brazil", code: "BR" },
  { name: "Brunei", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cabo Verde", code: "CV" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Costa Rica", code: "CR" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Democratic Republic of the Congo", code: "CD" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Eswatini", code: "SZ" },
  { name: "Ethiopia", code: "ET" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Greece", code: "GR" },
  { name: "Grenada", code: "GD" },
  { name: "Guatemala", code: "GT" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Honduras", code: "HN" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Ivory Coast", code: "CI" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Laos", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia", code: "FM" },
  { name: "Moldova", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montenegro", code: "ME" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "North Korea", code: "KP" },
  { name: "North Macedonia", code: "MK" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Qatar", code: "QA" },
  { name: "Romania", code: "RO" },
  { name: "Russia", code: "RU" },
  { name: "Rwanda", code: "RW" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia", code: "RS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Korea", code: "KR" },
  { name: "South Sudan", code: "SS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syria", code: "SY" },
  { name: "Taiwan", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Vatican City", code: "VA" },
  { name: "Venezuela", code: "VE" },
  { name: "Vietnam", code: "VN" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" }
];

const ManualLocationScreen = ({
  onStepChange,
  locationData,
  onLocationDataUpdate,
  onMapRegionUpdate,
  onMarkerUpdate,
}) => {
  const [currentView, setCurrentView] = useState('main'); // 'main' or specific field
  const [currentField, setCurrentField] = useState('');
  const [searchText, setSearchText] = useState('');
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const locationOptions = [
    {
      key: 'country',
      label: 'Country',
      value: locationData.country?.name || '',
      enabled: true,
    },
    {
      key: 'city',
      label: 'City',
      value: locationData.city?.name || '',
      enabled: !!locationData.country,
    },
    {
      key: 'neighborhood',
      label: 'Neighborhood',
      value: locationData.neighborhood?.name || '',
      enabled: !!locationData.city,
    },
  ];

  const getCurrentFieldLabel = () => {
    switch (currentField) {
      case 'country':
        return 'Country';
      case 'city':
        return 'City';
      case 'neighborhood':
        return 'Neighborhood';
      default:
        return '';
    }
  };

  const getSearchTypes = () => {
    switch (currentField) {
      case 'country':
        return '(regions)';
      case 'city':
        return '(cities)';
      case 'neighborhood':
        return 'establishment'; // Better for neighborhoods
      default:
        return '';
    }
  };

  const getLocationRestriction = () => {
    let restriction = '';

    if (currentField === 'city' && locationData.country) {
      restriction = `&components=country:${locationData.country.code}`;
    } else if (currentField === 'neighborhood' && locationData.city) {
      // Use coordinates-based search instead of component restriction
      if (locationData.city.center) {
        const { latitude, longitude } = locationData.city.center;
        // Search within ~10km radius of the city center
        restriction = `&location=${latitude},${longitude}&radius=10000`;
      } else {
        // Fallback to country restriction
        restriction = `&components=country:${locationData.country?.code || ''}`;
      }
    }

    return restriction;
  };

  const loadCountries = () => {
    // Convert countries to the format expected by the component
    const countryItems = ALL_COUNTRIES.map(country => ({
      place_id: `country_${country.code}`,
      structured_formatting: {
        main_text: country.name,
        secondary_text: country.code
      },
      description: country.name,
      country_code: country.code
    }));

    setAllSuggestions(countryItems);
    setFilteredSuggestions(countryItems);
  };

  const fetchNeighborhoodSuggestions = async () => {
    setLoading(true);
    try {
      const allResults = [];
      const seenPlaceIds = new Set();

      // Use more targeted search terms for neighborhoods
      const searchQueries = [
        locationData.city.name, // Search within the city
        `neighborhood ${locationData.city.name}`,
        `district ${locationData.city.name}`,
        `area ${locationData.city.name}`,
        // Add some common neighborhood-related terms
        'central', 'downtown', 'old town', 'new town'
      ];

      const restriction = getLocationRestriction();

      for (const query of searchQueries) {
        try {
          const encodedQuery = encodeURIComponent(query);
          const response = await fetch(
            `${AUTOCOMPLETE_URL}?key=${GOOGLE_PLACES_API_KEY}&input=${encodedQuery}&types=establishment${restriction}&language=en`
          );
          const json = await response.json();

          if (json.status === 'OK' && json.predictions) {
            json.predictions.forEach(prediction => {
              // Filter for neighborhood-like results
              const description = prediction.description.toLowerCase();
              const mainText = prediction.structured_formatting?.main_text?.toLowerCase() || '';

              // Only include results that seem neighborhood-related
              if (description.includes(locationData.city.name.toLowerCase()) &&
                (mainText.includes('district') ||
                  mainText.includes('neighborhood') ||
                  mainText.includes('area') ||
                  prediction.types?.some(type =>
                    ['neighborhood', 'sublocality', 'political'].includes(type)
                  ))) {

                if (!seenPlaceIds.has(prediction.place_id)) {
                  seenPlaceIds.add(prediction.place_id);
                  allResults.push(prediction);
                }
              }
            });
          }

          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error fetching for query ${query}:`, error);
        }
      }

      // Also try a direct search for neighborhoods using Places API
      try {
        const nearbyUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        if (locationData.city.center) {
          const { latitude, longitude } = locationData.city.center;
          const response = await fetch(
            `${nearbyUrl}?key=${GOOGLE_PLACES_API_KEY}&location=${latitude},${longitude}&radius=5000&type=neighborhood&language=en`
          );
          const json = await response.json();

          if (json.status === 'OK' && json.results) {
            json.results.forEach(result => {
              if (!seenPlaceIds.has(result.place_id)) {
                seenPlaceIds.add(result.place_id);
                // Convert nearby search result to autocomplete format
                allResults.push({
                  place_id: result.place_id,
                  structured_formatting: {
                    main_text: result.name,
                    secondary_text: result.vicinity
                  },
                  description: `${result.name}, ${result.vicinity}`,
                  types: result.types
                });
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching nearby neighborhoods:', error);
      }

      // Sort results alphabetically
      allResults.sort((a, b) => {
        const nameA = a.structured_formatting?.main_text || a.description;
        const nameB = b.structured_formatting?.main_text || b.description;
        return nameA.localeCompare(nameB);
      });

      setAllSuggestions(allResults);
      setFilteredSuggestions(allResults);
    } catch (error) {
      console.error('Error fetching neighborhood suggestions:', error);
      setAllSuggestions([]);
      setFilteredSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationSuggestions = async () => {
    setLoading(true);
    try {
      let searchQueries = [];

      if (currentField === 'city') {
        // More targeted city search
        searchQueries = [
          'city', 'town', 'municipality',
          'a', 'b', 'c', 'ma', 'sa', 'new', 'san'
        ];
      } else if (currentField === 'neighborhood') {
        // Neighborhood search using common starting letters
        searchQueries = [
          'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
          'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
          'u', 'v', 'w', 'x', 'y', 'z'
        ];
      } else {
        // Fallback or support for other types if needed
        searchQueries = ['a', 'b', 'c'];
      }

      const types = getSearchTypes(); // You likely change this based on currentField
      const restriction = getLocationRestriction();
      const allResults = [];
      const seenPlaceIds = new Set();

      for (const query of searchQueries) {
        try {
          const encodedQuery = encodeURIComponent(query);
          const response = await fetch(
            `${AUTOCOMPLETE_URL}?key=${GOOGLE_PLACES_API_KEY}&input=${encodedQuery}&types=${types}${restriction}&language=en`
          );
          const json = await response.json();

          if (json.status === 'OK' && json.predictions) {
            json.predictions.forEach(prediction => {
              if (!seenPlaceIds.has(prediction.place_id)) {
                seenPlaceIds.add(prediction.place_id);
                allResults.push(prediction);
              }
            });
          }

          // Add a short delay to avoid hitting rate limits
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Error fetching for query "${query}":`, error);
        }
      }

      // Sort the results alphabetically
      allResults.sort((a, b) => {
        const nameA = a.structured_formatting?.main_text || a.description;
        const nameB = b.structured_formatting?.main_text || b.description;
        return nameA.localeCompare(nameB);
      });

      setAllSuggestions(allResults);
      setFilteredSuggestions(allResults);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setAllSuggestions([]);
      setFilteredSuggestions([]);
    } finally {
      setLoading(false);
    }
  };


  const filterSuggestions = (text) => {
    if (!text.trim()) {
      setFilteredSuggestions(allSuggestions);
      return;
    }

    const filtered = allSuggestions.filter(item => {
      const mainText = item.structured_formatting?.main_text || item.description;
      const secondaryText = item.structured_formatting?.secondary_text || '';

      return mainText.toLowerCase().includes(text.toLowerCase()) ||
        secondaryText.toLowerCase().includes(text.toLowerCase());
    });

    setFilteredSuggestions(filtered);
  };

  const getPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `${PLACE_DETAILS_URL}?key=${GOOGLE_PLACES_API_KEY}&place_id=${placeId}&fields=geometry,address_components,formatted_address`
      );
      const json = await response.json();

      if (json.status === 'OK') {
        return json.result;
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const parseAddressComponents = (addressComponents) => {
    const components = {};

    addressComponents.forEach(component => {
      const types = component.types;

      if (types.includes('country')) {
        components.country = {
          name: component.long_name,
          code: component.short_name,
        };
      } else if (types.includes('locality') || types.includes('administrative_area_level_2') || types.includes('administrative_area_level_1')) {
        // For cities, we check multiple types as different countries may use different administrative levels
        if (!components.city) {
          components.city = {
            name: component.long_name,
          };
        }
      } else if (types.includes('neighborhood') || types.includes('sublocality')) {
        components.neighborhood = {
          name: component.long_name,
        };
      }
    });

    return components;
  };

  useEffect(() => {
    if (currentView === 'selection') {
      if (currentField === 'country') {
        loadCountries();
      } else {
        fetchLocationSuggestions();
      }
    }
  }, [currentView, currentField]);

  useEffect(() => {
    filterSuggestions(searchText);
  }, [searchText, allSuggestions]);

  const handleOptionPress = (optionKey) => {
    if (!locationOptions.find(opt => opt.key === optionKey)?.enabled) {
      return; // Don't allow selection if not enabled
    }

    setCurrentField(optionKey);
    setCurrentView('selection');
    setSearchText('');
    setAllSuggestions([]);
    setFilteredSuggestions([]);
  };

  const handleCountrySelect = (item) => {
    const selectedCountry = {
      id: item.country_code,
      name: item.structured_formatting?.main_text || item.description,
      code: item.country_code,
    };

    // Clear dependent fields when country changes
    onLocationDataUpdate({
      country: selectedCountry,
      city: null,
      neighborhood: null,
    });

    // Return to main view
    setCurrentView('main');
    setCurrentField('');
    setSearchText('');
    setAllSuggestions([]);
    setFilteredSuggestions([]);
  };

  const handleLocationSelect = async (item) => {
    setLoading(true);

    try {
      const placeDetails = await getPlaceDetails(item.place_id);

      if (placeDetails) {
        const addressComponents = parseAddressComponents(placeDetails.address_components);
        const center = {
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
        };

        const selectedItem = {
          id: item.place_id,
          name: item.structured_formatting?.main_text || item.description,
          fullName: item.description,
          center: center,
          ...addressComponents[currentField],
        };

        // Update location data based on current field
        const updateData = { ...locationData };
        updateData[currentField] = selectedItem;

        // Clear dependent fields when higher level changes
        if (currentField === 'city') {
          updateData.neighborhood = null;
        }

        // Also update parent locations if they exist in address components
        if (currentField !== 'country' && addressComponents.country) {
          updateData.country = {
            id: addressComponents.country.code,
            name: addressComponents.country.name,
            code: addressComponents.country.code,
          };
        }
        if (currentField !== 'city' && addressComponents.city) {
          updateData.city = {
            id: item.place_id + '_city',
            name: addressComponents.city.name,
          };
        }

        onLocationDataUpdate(updateData);
      } else {
        // Fallback if place details fail
        const selectedItem = {
          id: item.place_id,
          name: item.structured_formatting?.main_text || item.description,
          fullName: item.description,
        };

        const updateData = { ...locationData };
        updateData[currentField] = selectedItem;

        // Clear dependent fields
        if (currentField === 'city') {
          updateData.neighborhood = null;
        }

        onLocationDataUpdate(updateData);
      }
    } catch (error) {
      console.error('Error selecting item:', error);
    } finally {
      setLoading(false);
    }

    // Always return to main view after selection
    setCurrentView('main');
    setCurrentField('');
    setSearchText('');
    setAllSuggestions([]);
    setFilteredSuggestions([]);
  };

  const handleItemSelect = (item) => {
    if (currentField === 'country') {
      handleCountrySelect(item);
    } else {
      handleLocationSelect(item);
    }
  };

  const handleContinueToMap = () => {
    // Navigate to map if at least one location is selected with coordinates
    const lastLocationWithCoords = locationData.neighborhood?.center ||
      locationData.city?.center ||
      locationData.country?.center;

    if (lastLocationWithCoords) {
      onMapRegionUpdate({
        ...lastLocationWithCoords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      onMarkerUpdate(lastLocationWithCoords);
      onStepChange('map');
      console.log('{Map logs screen}', lastLocationWithCoords);
    }
  };

  const renderMainView = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>ADRES SEÇİMİ</Text>

      {locationOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.optionItem,
            !option.enabled && styles.optionItemDisabled
          ]}
          onPress={() => handleOptionPress(option.key)}
          disabled={!option.enabled}>

          <View style={styles.optionContent}>
            <Text style={[
              styles.optionLabel,
              !option.enabled && styles.optionLabelDisabled
            ]}>
              {option.label}
            </Text>
            {option.value ? (
              <Text style={styles.optionValue}>{option.value}</Text>
            ) : null}
          </View>

          <Text style={[
            styles.optionArrow,
            !option.enabled && styles.optionArrowDisabled
          ]}>
            {option.enabled ? '>' : '?'}
          </Text>
        </TouchableOpacity>
      ))}

      {(locationData.country || locationData.city || locationData.neighborhood) && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueToMap}>
          <Text style={styles.continueButtonText}>Haritada İşaretle</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSelectionView = () => (
    <View style={styles.content}>
      <Text style={styles.fieldLabel}>{getCurrentFieldLabel()}</Text>

      <View style={styles.searchContainer}>
        <SearchSVG width={20} height={20} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${getCurrentFieldLabel().toLowerCase()}...`}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.grey}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.lightgreen || '#007AFF'} />
          <Text style={styles.loadingText}>Loading {getCurrentFieldLabel().toLowerCase()}s...</Text>
        </View>
      )}

      <FlatList
        data={filteredSuggestions}
        renderItem={renderSelectionItem}
        keyExtractor={item => item.place_id}
        style={styles.selectionList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );

  const renderSelectionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.selectionItem}
      onPress={() => handleItemSelect(item)}>
      <View>
        <Text style={styles.selectionItemText}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        {item.structured_formatting?.secondary_text && (
          <Text style={styles.selectionItemSecondary}>
            {item.structured_formatting.secondary_text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderBreadcrumb = () => {
    const breadcrumbItems = [];

    if (locationData.country) {
      breadcrumbItems.push(locationData.country.name);
    }
    if (locationData.city) {
      breadcrumbItems.push(locationData.city.name);
    }
    if (locationData.neighborhood) {
      breadcrumbItems.push(locationData.neighborhood.name);
    }

    return breadcrumbItems.length > 0 ? (
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText}>
          {breadcrumbItems.join(' > ')}
        </Text>
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (currentView === 'selection') {
            setCurrentView('main');
            setCurrentField('');
            setSearchText('');
            setAllSuggestions([]);
            setFilteredSuggestions([]);
          } else {
            onStepChange('main');
          }
        }}>
          <BackwardSVG width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Manual Location</Text>
        <View style={{ width: 24 }} />
      </View>

      {currentView === 'main' ? renderMainView() : renderSelectionView()}
      {renderBreadcrumb()}
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
  content: {
    flex: 1,
    padding: mvs(20),
  },
  sectionTitle: {
    fontSize: mvs(12),
    fontWeight: '500',
    color: colors.grey,
    marginBottom: mvs(20),
    letterSpacing: 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: mvs(15),
    paddingHorizontal: mvs(5),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  optionItemDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: mvs(16),
    color: colors.black,
    fontWeight: '400',
  },
  optionLabelDisabled: {
    color: colors.grey,
  },
  optionValue: {
    fontSize: mvs(14),
    color: colors.grey,
    marginTop: mvs(2),
  },
  optionArrow: {
    fontSize: mvs(18),
    color: colors.black,
    fontWeight: '300',
  },
  optionArrowDisabled: {
    color: colors.grey,
  },
  continueButton: {
    backgroundColor: colors.lightgreen || '#007AFF',
    borderRadius: mvs(8),
    paddingVertical: mvs(15),
    alignItems: 'center',
    marginTop: mvs(30),
  },
  continueButtonText: {
    color: 'white',
    fontSize: mvs(16),
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: mvs(16),
    fontWeight: '600',
    marginBottom: mvs(10),
    color: colors.black,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: mvs(15),
    paddingVertical: mvs(10),
    borderRadius: mvs(8),
    marginBottom: mvs(15),
    gap: mvs(10),
  },
  searchInput: {
    flex: 1,
    fontSize: mvs(16),
    color: colors.black,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: mvs(20),
  },
  loadingText: {
    marginTop: mvs(8),
    fontSize: mvs(14),
    color: colors.grey,
  },
  selectionList: {
    flex: 1,
  },
  selectionItem: {
    paddingVertical: mvs(15),
    paddingHorizontal: mvs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  selectionItemText: {
    fontSize: mvs(16),
    color: colors.black,
    fontWeight: '500',
  },
  selectionItemSecondary: {
    fontSize: mvs(14),
    color: colors.grey,
    marginTop: mvs(2),
  },
  breadcrumb: {
    flexDirection: 'row',
    padding: mvs(20),
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  breadcrumbText: {
    fontSize: mvs(14),
    color: colors.grey,
  },
});

export default ManualLocationScreen;