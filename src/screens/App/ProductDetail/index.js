import React, {useState} from 'react';
import {View, Image, Dimensions, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import styles from './style';
import {Row} from '../../../components/atoms/row';
import ProductHeader from '../../../components/Headers/ProductHeader';
import ProductFooter from '../../../components/Footer/ProductFooter';
import AddModal from '../../../components/Modals/AddModal';
import ShareActions from '../../../components/Structure/ShareAction/ShareAction';
import ProviderInfo from '../../../components/Structure/ProviderInfo/ProviderInfo';
import ProductMenu from '../../../components/Structure/ProductMenu/ProductMenu';
import {useDispatch} from 'react-redux';
import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const ProductDetail = () => {
  const route = useRoute();
  const {item} = route.params;
  const [likedItems, setLikedItems] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [headerTitleVisible, setHeaderTitleVisible] = useState(false); // Track header title visibility
  const dispatch = useDispatch();

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
        [id]: true, // Mark this product as liked
      }));
      console.log('Added to favorites:', product);
    }
  };

  const onClose = () => {
    setIsModalVisible(false);
    setLikedItems(false);
  };
  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleBuyPress = () => {
    console.log('Buy Directly pressed');
  };

  const onScroll = event => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY > height * 0.25) {
      setHeaderTitleVisible(true); // Show title after scrolling past the image
    } else {
      setHeaderTitleVisible(false); // Hide title when scrolled back up
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ProductHeader
        title={item.title}
        filled={likedItems[item.id]}
        onHeartPress={handleHeartClick}
        id={item.id}
        product={item}
        headerTitleVisible={headerTitleVisible}
        productLink={item.productLink}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        <View style={styles.imageContainer}>
          <Image
            source={item.imageUrl}
            style={[styles.productImage, {width: width, height: height * 0.25}]}
          />
        </View>
        <View style={styles.itemContainer}>
          <Bold style={styles.productTitle}>{item.title}</Bold>
          <Regular style={styles.productPrice}>${item.price}</Regular>
          <Regular style={styles.productLocation}>{item.location}</Regular>
        </View>
        <ProductMenu
          color={item.color}
          condition={item.condition}
          material={item.material}
        />
        <View style={styles.descriptionContainer}>
          <Regular>{item.description}</Regular>
        </View>
        <ProviderInfo provider={item.provider} />

        <View style={styles.providerContainer}>
          <Row>
            <Regular>Show-ID</Regular>
            <Regular>{item.id}</Regular>
          </Row>
        </View>

        <ShareActions
          productTitle={item.title}
          productLink={item.productLink}
        />
      </ScrollView>
      <ProductFooter
        onChatPress={handleChatPress}
        onBuyPress={handleBuyPress}
      />
      {isModalVisible && <AddModal onClose={onClose} />}
    </SafeAreaView>
  );
};

export default ProductDetail;
