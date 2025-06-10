import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import LocationSvg from '../../assets/svg/location-svg';
import {CloseSvg, SearchSVG} from '../../assets/svg';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import {useTranslation} from 'react-i18next';

const SearchHeader = ({
  onFocusSearch,
  isSearchMode,
  onSearch,
  showLocationIcon = true,
  searchText,
  setSearchText,
}) => {
  const {t} = useTranslation();

  const handleClearText = () => {
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity style={styles.icon}>
          <SearchSVG width={22} height={22} fill={colors.grey} />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          onPressIn={onFocusSearch}
          placeholder={t('SearchBarplaceholder')}
          placeholderTextColor={colors.grey}
          keyboardType="default"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => {
            if (searchText.trim() !== '') {
              onSearch(searchText);
            }
          }}
        />

        {searchText.length > 0 ? (
          <TouchableOpacity
            onPress={handleClearText}
            style={styles.notificationIcon}>
            <CloseSvg width={18} height={18} fill={colors.grey} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: mvs(7),
    paddingTop: mvs(20),
    paddingBottom: mvs(10),
    backgroundColor: '#fbfbfb',
  },
  searchBarContainer: {
    // add shadow here
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3, // Android
    zIndex: 10,
    // borderWidth: 1,
    // borderColor: colors.grey,
    backgroundColor: colors.white,
    borderRadius: mvs(4),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(4),
    marginHorizontal: mvs(10),
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 10,
    color: colors.black,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  locationIcon: {
    backgroundColor: colors.green,
    borderRadius: 50,
    padding: 6,
  },
  notificationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
    width: 24,
    height: 24,
    borderRadius: 14,
  },
  cancelText: {
    color: colors.green,
    fontSize: mvs(16),
    fontWeight: 'bold',
  },
});

export default SearchHeader;
