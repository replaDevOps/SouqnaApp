/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
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
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';
import Regular from '../../../typography/RegularText';
import {HeartSvg} from '../../../assets/svg';
import Bold from '../../../typography/BoldText';
import styles from './styles';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState({});

  const {role} = useSelector(state => state.user);
  const favorites = useSelector(state => state.favorites.favorites);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {id: subCategoryId, name} = route.params;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetchProductsBySubCategory(subCategoryId);
      if (response?.data) {
        setProducts(response.data);
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
          <Regular style={styles.recommendedPrice}>${item.price} - USD</Regular>
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
          <Bold>No Listings Right Now</Bold>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderRecommendedItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.recommendedContainer}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
};

export default Products;
