import React, {useEffect, useState} from 'react';
import {FlatList, Text, Image, View} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchProducts} from '../../../../api/apiServices';
import styles from '../../../../screens/App/Search/style';

const GalleryContainer = () => {
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const {token} = useSelector(state => state.user);

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      const response = await fetchProducts(token);
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
      <View style={styles.productContainer}>
        <Image source={{uri: productImage}} style={styles.productImage} />
        <Text style={styles.productName}>{item.name || 'Fall'}</Text>
        <Text style={styles.productPrice}>${item.price || 0}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={apiProducts}
      keyExtractor={item => item.id.toString()} // Make sure the key is unique
      renderItem={renderProduct}
      ListEmptyComponent={
        productsLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Text>No products found</Text>
        )
      }
    />
  );
};

export default GalleryContainer;
