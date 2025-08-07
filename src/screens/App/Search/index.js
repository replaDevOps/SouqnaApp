/* eslint-disable react-native/no-inline-styles */

import {useEffect, useRef, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';
import SearchHeader from '../../../components/Headers/SearchHeader';
import styles from './style';
import AddModal from '../../../components/Modals/AddModal';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CategorySection from '../../../components/Structure/Search/CategorySection/CategorySection';
import RecommendedSection from '../../../components/Structure/Search/RecommendedSection/RecommendedSection';
import VerificationModal from '../../../components/Modals/VerificationModal';
import API, {fetchCategories} from '../../../api/apiServices';
import {setVerificationStatus} from '../../../redux/slices/userSlice';
import LogoHeader from '../../../components/Structure/Search/Header/LogoHeader';
import {Snackbar} from 'react-native-paper';
import BannerSlider from '../../../components/atoms/BannerSlider';
import ProductDashboard from '../../../components/atoms/Dashboard';
import {NotificationSVG} from '../../../assets/svg';
import {color} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const dashboardRefreshRef = useRef(null);

  const {token, verificationStatus, role} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [apiCategories, setApiCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [hasFetchedVerification, setHasFetchedVerification] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (role === 3) {
      return;
    }
    const fetchVerificationStatus = async () => {
      try {
        const response = await API.get('viewVerification', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const apiStatus = response.data?.data?.status || 0;
        dispatch(setVerificationStatus(apiStatus));

        console.log('API verification status in search: ', apiStatus);
      } catch (error) {
        console.error('Verification API error:', error);

        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === 'Unauthenticated'
        ) {
          dispatch(setVerificationStatus(0)); // Update Redux store
          console.log('Unauthenticated: setting Unverified status');
        }
      } finally {
        setHasFetchedVerification(true);
      }
    };

    if (token && isFocused) {
      fetchVerificationStatus();
    }
  }, [token, dispatch, isFocused, role]);

  useEffect(() => {
    // if (role === 3) return;
    const loadCategories = async () => {
      setCategoriesLoading(true);
      const response = await fetchCategories(token);
      if (response?.success) {
        setApiCategories(response.data);
      }
      setCategoriesLoading(false);
    };

    // if (token) {
    loadCategories();
    // }
  }, [setCategoriesLoading, token]);

  // Manage the modal visibility based on verificationStatus from Redux
  useEffect(() => {
    if (role === 3) {
      return;
    }
    if (
      hasFetchedVerification &&
      verificationStatus !== 1 &&
      verificationStatus !== 2 &&
      token
    ) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [verificationStatus, token, hasFetchedVerification, role]);

  useEffect(() => {
    if (role === 3) {
      return;
    }
    if (!isModalVisible) {
    }
  }, [isModalVisible, role]);

  const handleVerifyProfile = () => {
    // Logic to handle profile verification
    setModalVisible(false);
    // Navigate to the Verification screen
    navigation.navigate('Verification');
  };

  const handleSkipVerification = () => {
    setModalVisible(false);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  const onFocusSearch = () => {
    navigation.navigate('SearchResultsScreen', {
      searchText,
    });
  };

  const onCancelSearch = () => {
    setIsSearchMode(false);
  };

  const navigateToSearchResults = () => {
    navigation.navigate('SearchResultsScreen');
  };

  const onRefresh = async () => {
    console.log('Refreshing...');

    setRefreshing(true);
    try {
      dashboardRefreshRef.current?.(); // 👈 refresh dashboard

      setCategoriesLoading(true);
      const categoriesResponse = await fetchCategories(token);
      if (categoriesResponse?.success) {
        setApiCategories(categoriesResponse.data);
      }
      setCategoriesLoading(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
      console.log('Refresh complete');
    }
  };

  // Create a ref to store the RecommendedSection refresh function
  const recommendedRefreshRef = useRef(null);

  // Function to trigger RecommendedSection refresh
  const refreshRecommendedSection = () => {
    if (recommendedRefreshRef.current) {
      recommendedRefreshRef.current();
    }
  };

  // Enhanced onRefresh function that also refreshes RecommendedSection
  const onRefreshEnhanced = async () => {
    console.log('Refreshing...');

    setRefreshing(true);
    try {
      dashboardRefreshRef.current?.(); // 👈 refresh dashboard
      refreshRecommendedSection(); // 👈 refresh recommended section

      setCategoriesLoading(true);
      const categoriesResponse = await fetchCategories(token);
      if (categoriesResponse?.success) {
        setApiCategories(categoriesResponse.data);
      }
      setCategoriesLoading(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
      console.log('Refresh complete');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />

      <View style={styles.LogoHeader}>
        <LogoHeader />
      </View>
      <ScrollView
        contentContainerStyle={{backgroundColor: '#fbfbfb', flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshEnhanced}
          />
        }>
        <View
          style={{
            backgroundColor: '#fbfbfb',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            // padding: mvs(10),
          }}>
          <SearchHeader
            onFocusSearch={onFocusSearch}
            isSearchMode={isSearchMode}
            onCancelSearch={onCancelSearch}
            onSearch={navigateToSearchResults}
            showLocationIcon={false}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <TouchableOpacity
            style={{
              width: '10%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: mvs(10),
            }}
            onPress={() => {
              console.log('pressed');
              navigation.navigate('Notification');
            }}>
            <NotificationSVG color={color} />
          </TouchableOpacity>
        </View>

        <CategorySection categories={apiCategories} />

        {/* {!isModalVisible && hasFetchedVerification && <BannerSlider />} */}
        {!token ? null : role === 3 ? (
          <BannerSlider />
        ) : (
          <ProductDashboard onRefresh={onRefreshEnhanced} />
        )}

        <RecommendedSection onRefreshRef={recommendedRefreshRef} />
      </ScrollView>

      {isModalVisible && !token && <AddModal onClose={onClose} />}

      {(role !== 3 || !token) && (
        <VerificationModal
          visible={modalVisible}
          onVerify={handleVerifyProfile}
          onSkip={handleSkipVerification}
          onClose={() => setModalVisible(false)}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default SearchScreen;
