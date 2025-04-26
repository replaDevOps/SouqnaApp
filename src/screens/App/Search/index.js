import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import SearchHeader from '../../../components/Headers/SearchHeader';
import dummyData from '../../../util/dummyData';
import styles from './style';
import AddModal from '../../../components/Modals/AddModal';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CategorySection from '../../../components/Structure/Search/CategorySection/CategorySection';
import RecommendedSection from '../../../components/Structure/Search/RecommendedSection/RecommendedSection';
import GalleryContainer from '../../../components/Structure/Search/GallerySection/GallerySection';
import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';
import VerificationModal from '../../../components/Modals/VerificationModal';
import {fetchCategories} from '../../../api/apiServices';

const {categories, products, recommendedProducts} = dummyData;

const SearchScreen = () => {
  const [likedItems, setLikedItems] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigation = useNavigation();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allRecommendedProducts, setAllRecommendedProducts] = useState(
    recommendedProducts.slice(0, 6),
  );
  const [isEndOfResults, setIsEndOfResults] = useState(false);
  const {token, userData} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [apiCategories, setApiCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
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
  }, [token]);

  useEffect(() => {
    if (userData?.status === 0 || userData?.status === 3) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [userData?.status]);

  useEffect(() => {
    if (!isModalVisible) {
      setLikedItems({});
    }
  }, [isModalVisible]);

  const handleVerifyProfile = () => {
    // Logic to handle profile verification
    setModalVisible(false);
    // Navigate to the Verification screen
    navigation.replace('Verification');
  };

  const handleSkipVerification = () => {
    setModalVisible(false);
  };

  // Simulate an API call to fetch more data
  const loadMoreRecommendedProducts = useCallback(async () => {
    if (loading || isEndOfResults) return; // Prevent multiple API calls while loading or if all products are loaded
    setLoading(true);

    setTimeout(() => {
      const nextProducts = recommendedProducts.slice(
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
  }, [loading, allRecommendedProducts, recommendedProducts, isEndOfResults]);

  const handleHeartPress = id => {
    setLikedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleHeartClick = (id, product) => {
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
      // If the product is not in the favorites, add it
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
    setSelectedProduct(null); // Reset selected product
  };

  const onFocusSearch = () => {
    setIsSearchMode(true);
  };

  const onCancelSearch = () => {
    setIsSearchMode(false);
  };

  const navigateToSearchResults = () => {
    navigation.navigate('SearchResultsScreen');
  };

  const navigateToProductDetails = item => {
    navigation.navigate('ProductDetail', {item});
  };

  return (
    <View style={styles.container}>
      <SearchHeader
        onFocusSearch={onFocusSearch}
        isSearchMode={isSearchMode}
        onCancelSearch={onCancelSearch}
        onSearch={navigateToSearchResults}
        showLocationIcon={false}
      />

      {isSearchMode ? null : (
        <FlatList
          data={[{key: 'categories'}, {key: 'gallery'}, {key: 'recommended'}]}
          keyExtractor={item => item.key}
          renderItem={({item}) => {
            switch (item.key) {
              case 'categories':
                return categoriesLoading ? null : (
                  <CategorySection categories={apiCategories} />
                );

              case 'gallery':
                return <GalleryContainer products={products} />;
              case 'recommended':
                return (
                  <RecommendedSection
                    products={allRecommendedProducts}
                    loadMoreProducts={loadMoreRecommendedProducts}
                    loading={loading}
                    isEndOfResults={isEndOfResults}
                    likedItems={likedItems}
                    handleHeartClick={handleHeartClick}
                    navigateToProductDetails={navigateToProductDetails}
                  />
                );
              default:
                return null;
            }
          }}
        />
      )}

      {isModalVisible && <AddModal onClose={onClose} />}
      <VerificationModal
        visible={modalVisible}
        onVerify={handleVerifyProfile}
        onSkip={handleSkipVerification}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default SearchScreen;
