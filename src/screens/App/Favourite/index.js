import React, {useCallback, useState} from 'react';
import {View, FlatList, TouchableOpacity, Image, StatusBar} from 'react-native';
import {useSelector} from 'react-redux'; // Import dispatch
import MainHeader from '../../../components/Headers/MainHeader';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import {HeartSvg} from '../../../assets/svg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import styles from '../../../components/Structure/Search/RecommendedSection/style';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {mvs} from '../../../util/metrices';
import {
  BASE_URL_Product,
  getFavorites,
  removeFromFavorite,
} from '../../../api/apiServices';
import {showSnackbar} from '../../../redux/slices/snackbarSlice';

const FavouriteScreen = () => {
  const navigation = useNavigation();
  const {role, token} = useSelector(state => state.user);
  const {t} = useTranslation();
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        const fetchFavorites = async () => {
          const favs = await getFavorites(token);
          setFavorites(favs.data);
        };
        fetchFavorites();
      }
    }, [token]),
  );

  const handleHeartClick = async (id, product) => {
    if (role === 2) {
      showSnackbar('Log in as buyer');
      return;
    }
    // Check if the product is already in favorites
    const isInFavorites = favorites.some(fav => fav.product?.id === id);
    if (isInFavorites) {
      // Optimistic update
      const updatedFavorites = favorites.filter(fav => fav.product?.id !== id);
      setFavorites(updatedFavorites);

      // Actual API call
      await removeFromFavorite(id, token)
        .then(res => {
          if (res.success) {
            setFavorites(updatedFavorites);
          }
        })
        .catch(err => {
          // Revert optimistic update
          showSnackbar('Error removing from favorites', err?.message);
          setFavorites(favorites);
        });
    }
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <MainHeader title={t('favourites')} />
        <View style={styles.content}>
          <Image
            source={require('../../../assets/img/empty.png')}
            style={{height: 200, width: 200, marginBottom: 10}}
          />
          <Bold>{t('noFavourites')}</Bold>
        </View>
      </SafeAreaView>
    );
  }

  const renderFavoriteItem = ({item}) => {
    const favItem = item?.product;
    return (
      <TouchableOpacity
        style={styles.recommendedItem}
        onPress={() => {
          console.log('ITEM ID:', favItem.id);
          navigation.navigate('ProductDetail', {productId: favItem.id});
        }}>
        <Image
          source={{uri: `${BASE_URL_Product}${favItem.images?.[0]?.path}`}}
          style={styles.recommendedImage}
        />
        <View style={styles.recommendedTextContainer}>
          <Regular style={styles.recommendedTitle}>{favItem.name}</Regular>
          <Regular style={styles.recommendedPrice}>${favItem.price}</Regular>
        </View>
        {role != 2 && (
          <TouchableOpacity
            style={styles.heartIconContainer}
            onPress={() => handleHeartClick(favItem.id, favItem)}>
            <HeartSvg
              filled={favorites.some(fav => fav.product?.id === favItem.id)}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };
  console.log('Favourites', favorites);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={t('favourites')} />
      <View style={styles.recommendedContainer}>
        <FlatList
          data={favorites}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFavoriteItem}
          contentContainerStyle={{
            paddingTop: mvs(15),
            paddingBottom: mvs(60),
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavouriteScreen;
