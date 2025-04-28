import React, {useEffect, useState} from 'react';
import {FlatList, Text, Image, View, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchProducts} from '../../../../api/apiServices';
import styles from '../../../../screens/App/Search/style';
import Bold from '../../../../typography/BoldText';

const GalleryContainer = ({onRefresh, refreshing}) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const {token} = useSelector(state => state.user);

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);

      const filters = {
        productName: '',
        fromDate: '',
        toDate: '',
        status: '',
      };

      const response = await fetchProducts(token, filters);
      console.log('API Response:', response);
      if (response?.success && Array.isArray(response.data)) {
        setApiProducts(response.data);
      } else {
        console.error('Invalid products data', response);
      }
      setProductsLoading(false);
    };

    loadProducts();
  }, [token]);

  const renderProduct = ({item}) => {
    const productImage = item.images?.[0]?.path
      ? `https://backend.souqna.net${item.images[0].path}`
      : null;

    return (
      <View style={styles.galleryContainer}>
        <Image source={{uri: productImage}} style={styles.productImage} />
        <Bold style={styles.productTitle}>{item.name || 'Fall'}</Bold>
        <Bold style={styles.productPrice}>${item.price || 0}</Bold>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Bold style={styles.galleryLabel}>Gallery</Bold>
      <FlatList
        data={apiProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        horizontal={true}
        ListEmptyComponent={
          productsLoading ? (
            <Text>Loading...</Text>
          ) : (
            <Text>No products found</Text>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default GalleryContainer;
