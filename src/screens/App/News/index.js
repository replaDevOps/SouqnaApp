import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import React from 'react';
import { colors } from '../../../util/color';
import MainHeader from '../../../components/Headers/MainHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearCart, removeItem, updateQuantity } from '../../../redux/slices/cartSlice';

export default function NewsScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const navigation = useNavigation();

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 50;
  const discount = 0;
  const total = subTotal + deliveryCharge - discount;

  const handleQuantityChange = (id, change) => {
    dispatch(updateQuantity({ id, change }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem({ id }));
  };

  const handlePlaceOrder = () => {
    dispatch(clearCart());
    navigation.navigate('OrderCompleted');
  };

  // Helper function to extract image URI safely
  const getImageSource = (imageData) => {
    if (!imageData) return { uri: 'fallback_image_url_here' };
    
    // Handle case when image is already a string
    if (typeof imageData === 'string') {
      return { uri: imageData };
    }
    
    // Handle case when image is an object with uri property
    if (typeof imageData === 'object' && imageData.uri) {
      return { uri: imageData.uri };
    }
    
    // Default fallback
    return { uri: 'fallback_image_url_here' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={'Cart'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Order details</Text>

        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        ) : (
          <View style={styles.cartList}>
            {cartItems.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <Image 
                  source={getImageSource(item.image)} 
                  style={styles.itemImage}
                />
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <View style={{justifyContent:'center'}}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>Rs {item.price * item.quantity}</Text>
                    </View>
                    <View style={{justifyContent:'center'}} >
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Text>➖</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item.id, 1)}
                        >
                          <Text>➕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginVertical: 100 }} />
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <ImageBackground source={require('../../../assets/img/Pattern.png')} style={styles.summaryBackground}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub-Total</Text>
                <Text style={styles.summaryLabel}>Rs {subTotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Charge</Text>
                <Text style={styles.summaryLabel}>Rs {deliveryCharge}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryLabel}>Rs {discount}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalLabel}>Rs {total}</Text>
              </View>

              <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderButton}>
                <Text style={styles.placeOrderText}>Place My Order</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )}
    </SafeAreaView>
  );
}