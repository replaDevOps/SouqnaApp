import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, Image} from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';

const FavouriteScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {favorites} = useSelector(state => state.favorites);

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
      <View style={styles.container}>
        <MainHeader title={'Favourites'} />
        <View style={styles.content}>
          <Bold>There are no favourites right now</Bold>
        </View>
      </View>
    );
  }

  const renderFavoriteItem = ({item}) => (
    <TouchableOpacity
      style={styles.recommendedItem}
      onPress={() => navigation.navigate('ProductDetail', {item})}>
      <Image source={item.imageUrl} style={styles.recommendedImage} />
      <View style={styles.recommendedTextContainer}>
        <Regular style={styles.recommendedLocation}>{item.location}</Regular>
        <Regular style={styles.recommendedTitle}>{item.title}</Regular>
        <Regular style={styles.recommendedPrice}>${item.price}</Regular>
      </View>
      <TouchableOpacity
        style={styles.heartIconContainer}
        onPress={() => handleHeartClick(item.id, item)}>
        <HeartSvg filled={favorites.some(fav => fav.id === item.id)} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={'Favourites'} />
      <View style={styles.recommendedContainer}>
        <FlatList
          data={favorites}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFavoriteItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavouriteScreen;
