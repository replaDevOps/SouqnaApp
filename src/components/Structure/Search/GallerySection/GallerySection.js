import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchProducts} from '../../../../api/apiServices';
import Bold from '../../../../typography/BoldText';
import Regular from '../../../../typography/RegularText';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';
import { useTranslation } from 'react-i18next';
import Loader from '../../../Loader';

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
        <Bold style={styles.galleryLabel}>{t('gallery')}</Bold>
        <View>

        <FlatList
          data={apiProducts}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
          horizontal={true}
           contentInset={{ right: 25 }}
                                contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={
            productsLoading ? (
             <Loader width={mvs(30)} height={mvs(30)}/>
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


const styles = StyleSheet.create({
  container: {
  flex:1,
  },
  galleryLabel: {
    fontSize: mvs(19),
    paddingLeft: mvs(12),
    marginTop: mvs(20),
    marginBottom: mvs(7),
  },// Gallery Section Styles
  flatListContainer:{
    marginHorizontal:20
  },
  galleryContainer: {
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(10),
    // backgroundColor: colors.white,
    alignItems: 'center',
    borderTopLeftRadius:mvs(18),
    borderTopRightRadius:mvs(18),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6, // Android
    zIndex: 10,
  },
  productImage: {
    // borderRadius: mvs(18),
    width: mvs(120),
    height: mvs(90),
    resizeMode: 'cover',
    marginRight: 'auto',
  },
  productTitle: {
    fontSize: mvs(13),
    textAlign: 'center',
    color: colors.black,
    marginRight: 'auto',
    marginBottom: mvs(4),
  },
 
})

export default memo(GalleryContainer);
