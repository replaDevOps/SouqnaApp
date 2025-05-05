import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchProducts} from '../../../../api/apiServices';
import styles from '../../../../screens/App/Search/style';
import Bold from '../../../../typography/BoldText';
import Regular from '../../../../typography/RegularText';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';
import { useTranslation } from 'react-i18next';

const GalleryContainer = ({onRefresh, refreshing, onProductSelect}) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const {token} = useSelector(state => state.user);
  const {t} = useTranslation();

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

  const renderProduct = useCallback(
    ({item}) => {
      const productImage = item.images?.[0]?.path
        ? `https://backend.souqna.net${item.images[0].path}`
        : null;

      return (
        <TouchableOpacity
          style={styles.galleryContainer}
          onPress={() => onProductSelect(item.id)}>
          <Image source={{uri: productImage}} style={styles.productImage} />
          <View style={{marginTop: mvs(6)}}>
            <Text style={styles.productTitle}>{item.name || 'Fall'}</Text>
          </View>
          {/* <Bold style={styles.productPrice}>${item.price || 0}</Bold> */}
        </TouchableOpacity>
      );
    },
    [onProductSelect],
  );

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: colors.white}}>
        <Bold style={styles.galleryLabel}>{t('gallery')}</Bold>
        <FlatList
          data={apiProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
          horizontal={true}
          ListEmptyComponent={
            productsLoading ? (
              <Text>{t('loading')}</Text>
            ) : (
              <Text>{t('noProducts')}</Text>
            )
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

export default memo(GalleryContainer);
