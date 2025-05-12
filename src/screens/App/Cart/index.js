/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {
  fetchCartItems,
  BASE_URL_Product,
  deleteCartItem,
  updateCartItem,
} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import {mvs} from '../../../util/metrices';
import debounce from 'lodash/debounce'; // npm install lodash
import {useSelector} from 'react-redux';
import PaymentModal from '../../../components/Modals/PaymentModal';
import {useNavigation} from '@react-navigation/native';

export default function CartScreen() {
  const [cartData, setCartData] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // <-- Add refreshing state
  const {t} = useTranslation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const updateQtyRef = useRef({});
  const stockMap = useSelector(state => state.cart.items);
  const getStockForItem = productId => {
    const item = stockMap.find(item => item.id === productId);
    return item ? item.stock : 0;
  };

  const subTotal = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharge = 50;
  const discount = 0;
  const total = subTotal + deliveryCharge - discount;
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const navigation = useNavigation();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectPaymentMethod = method => {
    setSelectedPaymentMethod(method);
  };

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
    setRefreshing(false); // Stop refreshing after loading data
  };

  useEffect(() => {
    loadCartItems();
  }, [refreshTrigger]);

  const debouncedUpdate = useCallback((cartItemId, qty, productID) => {
    if (!updateQtyRef.current[cartItemId]) {
      updateQtyRef.current[cartItemId] = debounce(
        async (id, quantity, prodId) => {
          const response = await updateCartItem(id, quantity, prodId);
          if (!response?.success) {
            setSnackbarMessage(
              response?.message || 'Failed to update item quantity',
            );
            setSnackbarVisible(true);
          }
        },
        500,
      );
    }

    updateQtyRef.current[cartItemId](cartItemId, qty, productID);
  }, []);

  const handleQuantityChange = (productId, change) => {
    const stock = getStockForItem(productId); // Get the available stock for the item

    setCartData(prev => {
      const updatedCart = prev.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          if (newQuantity > stock) {
            setSnackbarMessage(`Cannot exceed stock quantity of ${stock}`);
            setSnackbarVisible(true);
            return item; // Don't update the quantity if it exceeds stock
          }
          debouncedUpdate(item.cartItemId, newQuantity, item.id); // Debounced update
          return {...item, quantity: newQuantity}; // Update quantity if within stock limit
        }
        return item;
      });

      return updatedCart;
    });
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

  // const handlePlaceOrder = handleOrderSubmit => {
  //   navigation.navigate('Checkout', {
  //     onSubmit: handleOrderSubmit, // Pass it as param
  //   });
  // };

  const handlePlaceOrder = () => {
    handleOpenModal(true);
  };

  const getImageSource = imageData => {
    if (!imageData) {
      return {uri: 'fallback_image_url_here'};
    }
    if (typeof imageData === 'string') {
      return {uri: imageData};
    }
    if (imageData.uri) {
      return {uri: imageData.uri};
    }
    return {uri: 'fallback_image_url_here'};
  };

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    setRefreshTrigger(prev => prev + 1); // Trigger the cart data reload
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={t('title')} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Trigger refresh on pull
          />
        }>
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
                <Text style={styles.placeOrderText}>{t('checkout')}</Text>
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
      <PaymentModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSelectPaymentMethod={handleSelectPaymentMethod}
      />
    </SafeAreaView>
  );
}
