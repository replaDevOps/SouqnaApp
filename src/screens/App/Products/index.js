/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';

import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';
import MainHeader from '../../../components/Headers/MainHeader';
import {
  BASE_URL_Product,
  fetchProductsBySubCategory,
} from '../../../api/apiServices';
import {mvs} from '../../../util/metrices';
import Regular from '../../../typography/RegularText';
import {HeartSvg} from '../../../assets/svg';
import Bold from '../../../typography/BoldText';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import CarFilters from '../../../components/atoms/CarFilters';

const Products = () => {
  const [filters, setFilters] = useState({
  minPrice: '',
  maxPrice: '',
  brand: '',
  buildYear: '',
});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState({});
    const {t} = useTranslation();

  const {role, id: userId} = useSelector(state => state.user);
  const favorites = useSelector(state => state.favorites.favorites);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {id: subCategoryId, name} = route.params;
  const getCurrencySymbol = (currency = 'USD') => {
    switch (currency?.toUpperCase?.()) {
      case 'TRY':
        return '₺';
      case 'USD':
        return '$';
      case 'SYP':
        return '£';
      default:
        return '$';
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetchProductsBySubCategory(subCategoryId);
      if (response?.data) {
const parsedProducts = response.data.map(product => {
  try {
    const customFields = JSON.parse(product.custom_fields || '[]');
    const yearField = customFields.find(f => f.name === 'yearofManufacture');
    const brandField = customFields.find(f => f.name === 'make_Brand');

    return {
      ...product,
      buildYear: yearField?.value || '',
      brand: brandField?.value || '',
    };
  } catch (e) {
    console.warn('Failed to parse custom fields:', e);
    return product;
  }
});

setProducts(parsedProducts);

        // setProducts(response.data);
        console.log('Fetch Products by subcategory:', response.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [subCategoryId]);

  const likedItemes = useMemo(() => {
    const map = {};
    favorites.forEach(item => {
      map[item.id] = true;
    });
    return map;
  }, [favorites]);

  const navigateToProductDetails = productId => {
    navigation.navigate('ProductDetail', {productId});
    console.log('Product ID: ', productId);
  };

  const handleHeartClick = (id, product) => {
    if (likedItems[id]) {
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
  const filteredProducts = useMemo(() => {
  return products.filter(product => {
    if (name !== 'Cars') return true;

    const price = Number(product.price);
    const min = Number(filters.minPrice || 0);
    const max = Number(filters.maxPrice || Infinity);
    const brandMatch = filters.brand
      ? product.brand?.toLowerCase().startsWith(filters.brand.toLowerCase())
      : true;
    const yearMatch = filters.buildYear
      ? String(product.buildYear)?.startsWith(filters.buildYear)
      : true;

    return (
      price >= min &&
      price <= max &&
      brandMatch &&
      yearMatch
    );
  });
}, [filters, products, name]);


  const renderRecommendedItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.recommendedItem}
        onPress={() => navigateToProductDetails(item.id)}>
        <Image
          source={{uri: `${BASE_URL_Product}${item.images?.[0]?.path}`}}
          style={styles.recommendedImage}
        />
        <View style={styles.recommendedTextContainer}>
          <Regular style={styles.recommendedTitle}>{item.name}</Regular>
          <Regular style={styles.recommendedPrice}>
            {getCurrencySymbol(item?.currency)}{' '}
            {Number(item.price).toLocaleString()}
          </Regular>
        </View>
        {role !== 2 && (
          <TouchableOpacity
            onPress={() => handleHeartClick(item.id, item)}
            style={styles.heartIconContainer}>
            <HeartSvg filled={likedItemes[item.id]} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ),
    [handleHeartClick, likedItemes, navigateToProductDetails],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={name} showBackIcon />

      {loading ? (
        <View style={styles.noListingsContainer}>
          <ActivityIndicator size="large" style={{marginTop: 20}} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.noListingsContainer}>
          <Image
            source={require('../../../assets/img/empty.png')}
            style={{width: '90%', resizeMode: 'contain', height: mvs(200)}}
          />
          <Bold>{t('No Listings Right Now')}</Bold>
        </View>
      ) : (
      <>
        {name?.toLowerCase() === 'cars' && (
          <CarFilters filters={filters} setFilters={setFilters} />
        )}

        <FlatList
          data={filteredProducts}
          renderItem={renderRecommendedItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.recommendedContainer}
          numColumns={2}
        />
        </>
      )}
    </SafeAreaView>
  );
};

export default Products;
