import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BackSVG} from '../../../assets/svg';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const SearchResultsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  // Get the search text passed from SearchScreen
  React.useEffect(() => {
    if (route.params?.searchText) {
      setSearchText(route.params.searchText);
    }
  }, [route.params?.searchText]);

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackSVG />
        </TouchableOpacity>

        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search Results"
            placeholderTextColor={colors.grey}
          />
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}>
            <Text style={styles.clearText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text>Results for: {searchText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: mvs(10),
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(10),
  },
  backButton: {
    marginRight: mvs(10),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.lightGray,
    borderRadius: mvs(50),
    paddingHorizontal: mvs(10),
  },
  searchBar: {
    flex: 1,
    height: mvs(40),
    fontSize: mvs(16),
    marginLeft: mvs(10),
    color: colors.grey,
  },
  clearButton: {
    marginLeft: mvs(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    color: colors.grey,
    fontSize: mvs(18),
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: mvs(20),
  },
});

export default SearchResultsScreen;
