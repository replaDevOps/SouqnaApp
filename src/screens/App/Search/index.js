/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchHeader from '../../../components/Headers/SearchHeader';
import styles from './style';
import AddModal from '../../../components/Modals/AddModal';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CategorySection from '../../../components/Structure/Search/CategorySection/CategorySection';
import RecommendedSection from '../../../components/Structure/Search/RecommendedSection/RecommendedSection';
import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';
import VerificationModal from '../../../components/Modals/VerificationModal';
import API, {
  fetchBuyerProducts,
  fetchCategories,
} from '../../../api/apiServices';
import {setVerificationStatus} from '../../../redux/slices/userSlice';
import LogoHeader from '../../../components/Structure/Search/Header/LogoHeader';
import {Snackbar} from 'react-native-paper';
import {colors} from '../../../util/color';
import {MapMarkerSVG} from '../../../assets/svg';
import BannerSlider from '../../../components/atoms/BannerSlider';
import ProductDashboard from '../../../components/atoms/Dashboard';

const SearchScreen = () => {
  const [likedItems, setLikedItems] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigation = useNavigation();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allRecommendedProducts, setAllRecommendedProducts] = useState([]);

  const [isEndOfResults, setIsEndOfResults] = useState(false);
  const {token, verificationStatus, role} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [apiCategories, setApiCategories] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // New state for pull-to-refresh
  const isFocused = useIsFocused();
  const [hasFetchedVerification, setHasFetchedVerification] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchText, setSearchText] = useState('');

  const showSnackbar = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

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

        // Only get the verification status from the API response
        const apiStatus = response.data?.data?.status || 0; // Defaults to 0 if status is not available
        dispatch(setVerificationStatus(apiStatus)); // Store status in Redux

        console.log('API verification status: ', apiStatus);
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
        setLoading(false);
      }
    };

    if (token && isFocused) {
      fetchVerificationStatus();
    }
  }, [token, dispatch, isFocused, role]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      const response = await fetchBuyerProducts(token, {}, role);
      if (response?.success) {
        const products = response.data;
        setAllRecommendedProducts(products.slice(0, 6));
        setAllProducts(products);
        setApiProducts(products);
        setIsEndOfResults(false);
      }

      setLoading(false);
    };

    loadProducts();
  }, [token, role, setApiProducts]);

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
      setLikedItems({});
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

  // Simulate an API call to fetch more data
  const loadMoreRecommendedProducts = useCallback(async () => {
    if (loading || isEndOfResults) {
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const nextProducts = allRecommendedProducts.slice(
        allRecommendedProducts.length,
        allRecommendedProducts.length + 6,
      );

      if (nextProducts.length === 0) {
        setIsEndOfResults(true);
      } else {
        setAllRecommendedProducts(prevState => [...prevState, ...nextProducts]);
      }

      setLoading(false);
    }, 1500);
  }, [loading, allRecommendedProducts, isEndOfResults]);

  const handleHeartClick = (id, product) => {
    if (role === 2) {
      showSnackbar('Log in as buyer');
      return;
    }

    if (likedItems[id]) {
      // If the product is already in the favorites, remove it
      dispatch(removeFavorite(product));
      setLikedItems(prevState => {
        const updatedState = {...prevState};
        delete updatedState[id];
        return updatedState;
      });
      console.log('Removed from favorites:', product);
    } else {
      dispatch(addFavorite(product));
      setLikedItems(prevState => ({
        ...prevState,
        [id]: true,
      }));
      console.log('Added to favorites:', product);
    }
  };

  const onClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
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

  const navigateToProductDetails = productId => {
    navigation.navigate('ProductDetail', {productId});
    console.log('Product ID: ', productId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setCategoriesLoading(true);
      const categoriesResponse = await fetchCategories(token);
      if (categoriesResponse?.success) {
        setApiCategories(categoriesResponse.data);
      }
      setCategoriesLoading(false);

      const productsResponse = await fetchBuyerProducts(token, {}, role);
      if (productsResponse?.success) {
        const products = productsResponse.data;
        setAllRecommendedProducts(products.slice(0, 6));
        setApiProducts(products);
        setIsEndOfResults(false);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />

      <View style={styles.LogoHeader}>
        <LogoHeader />
      </View>

      {/* Map */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Map', {allProducts})}
        // onPress={() => setModalVisible(true)}
        style={styles.mapContainer}>
        <MapMarkerSVG width={35} height={35} fill={colors.white} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{backgroundColor: '#fbfbfb'}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{backgroundColor: '#fbfbfb'}}>
          <SearchHeader
            onFocusSearch={onFocusSearch}
            isSearchMode={isSearchMode}
            onCancelSearch={onCancelSearch}
            onSearch={navigateToSearchResults}
            showLocationIcon={false}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </View>

        <CategorySection categories={apiCategories} />

        {/* {!isModalVisible && hasFetchedVerification && <BannerSlider />} */}
        {hasFetchedVerification || role === 3 ? (
          <BannerSlider />
        ) : (
          <ProductDashboard />
        )}

        {/* <BannerSlider /> */}

        {/* {role !== 2 && role !== '2' && (
          <GalleryContainer
            onProductSelect={navigateToProductDetails}
            onRefresh={onRefresh}
          />
        )} */}

        <RecommendedSection
          products={allRecommendedProducts}
          loadMoreProducts={loadMoreRecommendedProducts}
          onRefresh={onRefresh}
          isEndOfResults={isEndOfResults}
          likedItems={likedItems}
          handleHeartClick={handleHeartClick}
          navigateToProductDetails={navigateToProductDetails}
        />
      </ScrollView>

      {isModalVisible && !token && <AddModal onClose={onClose} />}

      <VerificationModal
        visible={modalVisible}
        onVerify={handleVerifyProfile}
        onSkip={handleSkipVerification}
        onClose={() => setModalVisible(false)}
      />
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
