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
// import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
// import {clearCart, updateQuantity} from '../../../redux/slices/cartSlice';
import {useTranslation} from 'react-i18next';
import {
  fetchCartItems,
  BASE_URL_Product,
  deleteCartItem,
} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import {mvs} from '../../../util/metrices';

export default function CartScreen() {
  // const dispatch = useDispatch();
  const [cartData, setCartData] = useState([]);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            id: item.product?.id,
            cartItemId: item.id,
            name: item.product?.name || 'Unnamed',
            quantity: item.qty || 1,
            price: parseFloat(item.price),
            image: item.product?.images?.[0]?.path
              ? `${BASE_URL_Product}${item.product.images[0].path}`
              : null,
          }));

          normalizedItems.forEach(item => {
            const existingIndex = allItems.findIndex(i => i.id === item.id);
            if (existingIndex !== -1) {
              allItems[existingIndex].quantity += item.quantity;
            } else {
              allItems.push(item);
            }
          });

          page += 1;
        } else {
          hasMore = false;
        }
      }

      setCartData(allItems);
    };

    loadCartItems();
  }, [refreshTrigger]);

  const handleQuantityChange = (id, change) => {
    setCartData(prev =>
      prev.map(item =>
        item.id === id
          ? {...item, quantity: Math.max(1, item.quantity + change)}
          : item,
      ),
    );
    // // no Redux dispatch
    // dispatch(updateQuantity({id, change}));
  };

  const handleRemoveItem = async cartItemId => {
    const response = await deleteCartItem(cartItemId);
    if (response?.success) {
      setCartData(prev => prev.filter(item => item.cartItemId !== cartItemId));
      setSnackbarMessage('Item removed from cart');
      setSnackbarVisible(true);
      setRefreshTrigger(prev => prev + 1);
    } else {
      console.warn('Failed to remove item from cart');
      setSnackbarMessage('Failed to remove item');
      setSnackbarVisible(true);
    }
  };

  const handlePlaceOrder = () => {
    // // no Redux clearCart
    // dispatch(clearCart());
    setCartData([]);
    // navigation.navigate('OrderCompleted');
  };

  const getImageSource = imageData => {
    if (!imageData) return {uri: 'fallback_image_url_here'};
    if (typeof imageData === 'string') return {uri: imageData};
    if (imageData.uri) return {uri: imageData.uri};
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
                    onPress={() => handleRemoveItem(item.cartItemId)}>
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
          bottom: mvs(70),
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
