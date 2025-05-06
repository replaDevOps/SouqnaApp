import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchProducts} from '../../../../api/apiServices';
import Bold from '../../../../typography/BoldText';
import Regular from '../../../../typography/RegularText';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';
import { useTranslation } from 'react-i18next';
import Loader from '../../../Loader';


const {width} = Dimensions.get('window');

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
        <View style={styles.productWrapper}>
          <TouchableOpacity
            style={styles.galleryContainer}
            onPress={() => onProductSelect(item.id)}>
            <Image source={{uri: productImage}} style={styles.productImage} />
            <View style={{paddingVertical: mvs(15)}}>
              <Text style={styles.productTitle}>{item.name || 'Fall'}</Text>
            </View>
            {/* <Bold style={styles.productPrice}>${item.price || 0}</Bold> */}
          </TouchableOpacity>
        </View>
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
          ItemSeparatorComponent={() => <View style={{width: mvs(4)}} />}
          contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={
            // productsLoading ? (
            //  <Loader width={mvs(30)} height={mvs(30)}/>
            // ) : (
              <Text>{t('noProducts')}</Text>
          //   )
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
    flex: 1,
    paddingBottom: mvs(15), // Add padding at the bottom to ensure shadow visibility
  },
  galleryLabel: {
    fontSize: mvs(19),
    paddingLeft: mvs(12),
    marginTop: mvs(20),
    marginBottom: mvs(12), // Increased to provide more space
  },
  flatListContainer: {
    paddingHorizontal: mvs(10),
    paddingBottom: mvs(10), // Add padding to make shadow visible
  },
  productWrapper: {
    // paddingBottom: mvs(10), // This creates space for the shadow to be visible
    paddingHorizontal: mvs(5),
    marginBottom: mvs(10), // Extra margin to ensure shadow is visible
  },
  galleryContainer: {
    width: width * 0.4,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: mvs(10),
    justifyContent: 'center',
    // Shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8, // Increased for Android
    // Remove overflow: 'hidden' to allow shadow to display properly
  },
  productImage: {
    width: '100%',
    height: mvs(100),
    resizeMode: 'cover',
    borderTopLeftRadius: mvs(10),
    borderTopRightRadius: mvs(10),
  },
  productTitle: {
    fontSize: mvs(18),
    textAlign: 'center',
    color: colors.black,
    marginRight: 'auto',
    marginBottom: mvs(4),
  },
})

export default memo(GalleryContainer);