/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';

import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';
import MainHeader from '../../../components/Headers/MainHeader';
import {BASE_URL, fetchProductsBySubCategory} from '../../../api/apiServices';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';
import Regular from '../../../typography/RegularText';
import {HeartSvg} from '../../../assets/svg';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState({});
  
  const {role} = useSelector(state => state.user);

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
          source={{uri: `https://backend.souqna.net${item.images?.[0]?.path}`}}
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
            <HeartSvg filled={likedItems[item.id]} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ),
    [handleHeartClick, likedItems, navigateToProductDetails],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={name} showBackIcon />
      {loading ? (
        <ActivityIndicator size="large" style={{marginTop: 20}} />
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
const {width} = Dimensions.get('window');
// const imageWidth = width * 0.4;
const cardWidth = (width - mvs(45)) / 2;
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  list: {padding: 10},
  card: {
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  heart: {
    marginLeft: 10,
  },
  location: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedText: {
    fontSize: mvs(18),
  },
  // Recommended Section Styles
  recommendedContainer: {
    marginTop: mvs(20),
    paddingHorizontal: mvs(10),
    // paddingVertical: mvs(10),
    paddingBottom: mvs(10),
    overflow: 'visible',
    // elevation: 2,
    // backgroundColor: colors.white,
  },
  recommendedItem: {
    width: cardWidth,
    marginHorizontal: mvs(8),
    marginBottom: mvs(13),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    elevation: 3, // Add this for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  recommendedImage: {
    width: '100%',
    height: mvs(130),
    resizeMode: 'cover',
    borderTopLeftRadius: mvs(10),
    borderTopRightRadius: mvs(10),
    // marginBottom: mvs(8),
  },
  recommendedLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: mvs(4),
  },
  recommendedTextContainer: {
    flexDirection: 'column',
    // elevation: 3,
    paddingVertical: mvs(6),
    paddingHorizontal: mvs(6),
  },
  recommendedLocation: {
    fontSize: mvs(12),
    color: colors.grey,
    marginLeft: mvs(2),
    flexWrap: 'wrap',
  },
  recommendedTitle: {
    fontSize: mvs(15),
    fontWeight: 'bold',
  },
  recommendedPrice: {
    fontSize: mvs(15),
    fontWeight: '400',
    color: colors.green,
    paddingTop: mvs(4),
  },

  // Heart Icon Styles
  heartIconContainer: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: mvs(20),
    padding: mvs(5),
  },

  endOfResultsText: {
    textAlign: 'center',
  },
});
