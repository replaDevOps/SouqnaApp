import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import LocationSvg from '../../assets/svg/location-svg';
import {NotificationSVG, SearchSVG} from '../../assets/svg';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const SearchHeader = ({
  onFocusSearch,
  isSearchMode,
  onCancelSearch,
  onSearch,
  showLocationIcon = true,
}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const onNotification = () => {
    navigation.navigate('Notification');
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity style={styles.icon}>
          <SearchSVG />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          onPress={onFocusSearch}
          placeholder={t('placeholder')}
          placeholderTextColor={colors.grey}
          keyboardType="default"
          onFocus={onFocusSearch}
          onSubmitEditing={onSearch}
        />

        {!isSearchMode && showLocationIcon && (
          <TouchableOpacity style={styles.locationIconContainer}>
            <View style={styles.locationIcon}>
              <LocationSvg width={18} height={18} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {isSearchMode ? (
        <TouchableOpacity
          onPress={onCancelSearch}
          style={styles.notificationIcon}>
          <Text style={styles.cancelText}>{t('cancel')}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onNotification}
          style={styles.notificationIcon}>
          <NotificationSVG />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: mvs(10),
    paddingTop: mvs(10),
    paddingBottom: mvs(10),
    backgroundColor: colors.white,
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
    marginRight: mvs(20),
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 10,
    color: colors.grey,
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
  },
  cancelText: {
    color: colors.green,
    fontSize: mvs(16),
    fontWeight: 'bold',
  },
});

export default SearchHeader;
