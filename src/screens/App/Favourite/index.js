import React from 'react';
import {View, FlatList, TouchableOpacity, Image, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux'; // Import dispatch
import MainHeader from '../../../components/Headers/MainHeader';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import {HeartSvg} from '../../../assets/svg';
import {useNavigation} from '@react-navigation/native';
import styles from '../../../components/Structure/Search/RecommendedSection/style';
import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {mvs} from '../../../util/metrices';
import {BASE_URL_Product} from '../../../api/apiServices';

const FavouriteScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {favorites} = useSelector(state => state.favorites);
  const {role} = useSelector(state => state.user);
  const {t} = useTranslation();

  console.log('Favorites:', favorites);

  const handleHeartClick = (id, product) => {
    // Check if the product is already in favorites
    const isInFavorites = favorites.some(fav => fav.id === id);

    if (isInFavorites) {
      // If the product is already in favorites, remove it
      dispatch(removeFavorite(product));
      console.log('Removed from favorites:', product);
    } else {
      // If the product is not in favorites, add it
      dispatch(addFavorite(product));
      console.log('Added to favorites:', product);
    }
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <MainHeader title={t('favourites')} showBackIcon={true}/>
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

  const renderFavoriteItem = ({item}) => (
    <TouchableOpacity
      style={styles.recommendedItem}
      onPress={() => {
        console.log('ITEM ID:', item.id);
        navigation.navigate('ProductDetail', {productId: item.id});
      }}>
      <Image
        source={{uri: `${BASE_URL_Product}${item.images?.[0]?.path}`}}
        style={styles.recommendedImage}
      />
      <View style={styles.recommendedTextContainer}>
        {/* <Regular
          style={styles.recommendedLocation}
          numberOfLines={2}
          ellipsizeMode="tail">
          {item.location}
        </Regular> */}
        <Regular style={styles.recommendedTitle}>{item.name}</Regular>
        <Regular style={styles.recommendedPrice}>${item.price}</Regular>
      </View>
      {role != 2 && (
        <TouchableOpacity
          style={styles.heartIconContainer}
          onPress={() => handleHeartClick(item.id, item)}>
          <HeartSvg filled={favorites.some(fav => fav.id === item.id)} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
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
