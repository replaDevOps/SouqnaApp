import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {clearCart, updateQuantity} from '../../../redux/slices/cartSlice';
import {useTranslation} from 'react-i18next';
import {
  fetchCartItems,
  BASE_URL_Product,
  deleteCartItem,
} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import {mvs} from '../../../util/metrices';

export default function CartScreen() {
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState([]);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const subTotal = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharge = 50;
  const discount = 0;
  const total = subTotal + deliveryCharge - discount;

  useEffect(() => {
    const loadCartItems = async () => {
      let allItems = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetchCartItems(page, 10);
        if (response?.data?.length) {
          const normalizedItems = response.data.map(item => ({
            id: item.id,
            name: item.product?.name || 'Unnamed',
            quantity: item.qty || 1,
            price: 100, // Replace with actual price if available in API
            image: item.product?.images?.[0]?.path
              ? `${BASE_URL_Product}${item.product.images[0].path}`
              : null,
          }));
          allItems = [...allItems, ...normalizedItems];
          page += 1;
        } else {
          hasMore = false;
        }
      }

      setCartData(allItems);
    };

    loadCartItems();
  }, []);

  const handleQuantityChange = (id, change) => {
    dispatch(updateQuantity({id, change}));
  };

  const handleRemoveItem = async id => {
    const response = await deleteCartItem(id);
    if (response?.success) {
      setCartData(prev => prev.filter(item => item.id !== id));
      setSnackbarMessage('Item removed from cart');
      setSnackbarVisible(true);
    } else {
      console.warn('Failed to remove item from cart');
      setSnackbarMessage('Failed to remove item');
      setSnackbarVisible(true);
    }
  };

  const handlePlaceOrder = () => {
    dispatch(clearCart());
    // navigation.navigate('OrderCompleted');
  };

  // Helper function to extract image URI safely
  const getImageSource = imageData => {
    if (!imageData) return {uri: 'fallback_image_url_here'};

    // Handle case when image is already a string
    if (typeof imageData === 'string') {
      return {uri: imageData};
    }

    // Handle case when image is an object with uri property
    if (typeof imageData === 'object' && imageData.uri) {
      return {uri: imageData.uri};
    }

    // Default fallback
    return {uri: 'fallback_image_url_here'};
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={t('title')} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('orderDetails')}</Text>

        {cartData.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>{t('empty')}</Text>
          </View>
        ) : (
          <View style={styles.cartList}>
            {cartData.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={getImageSource(item.image)}
                  style={styles.itemImage}
                />
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <View style={{justifyContent: 'center'}}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>$ {item.price}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}>
                          <Text>➖</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item.id, 1)}>
                          <Text>➕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id)}>
                    <Text style={styles.removeButtonText}>{t('remove')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{marginVertical: 100}} />
      </ScrollView>

      {cartData.length > 0 && (
        <View style={styles.summaryContainer}>
          <ImageBackground
            source={require('../../../assets/img/Pattern.png')}
            style={styles.summaryBackground}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
                <Text style={styles.summaryLabel}>$ {subTotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('delivery')}</Text>
                <Text style={styles.summaryLabel}>$ {deliveryCharge}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('discount')}</Text>
                <Text style={styles.summaryLabel}>$ {discount}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('total')}</Text>
                <Text style={styles.totalLabel}>$ {total}</Text>
              </View>

              <TouchableOpacity
                onPress={handlePlaceOrder}
                style={styles.placeOrderButton}>
                <Text style={styles.placeOrderText}>{t('placeOrder')}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          position: 'absolute',
          bottom: mvs(70), // push it above the Buy button
          left: 10,
          right: 10,
          borderRadius: 8,
        }}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}
