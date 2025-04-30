import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Image, StyleSheet, StatusBar } from 'react-native';
import React from 'react';
// import { updateQuantity, removeItem, clearCart } from '../redux/cartSlice';
import { colors } from '../../../util/color';
import MainHeader from '../../../components/Headers/MainHeader';
import { mvs } from '../../../util/metrices';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
// import { useDispatch, useSelector } from 'react-redux';

export default function NewsScreen() {
  // const dispatch = useDispatch();
  // const cartItems = useSelector(state => state.cart.items);

  const cartItems = [
    {
      id: 1,
      name: 'Chicken Burger',
      price: 500,
      quantity: 2,
      restaurant: 'Zinger House',
      image: require('../../../assets/img/phone.png'),
    },
    {
      id: 2,
      name: 'Pizza Slice',
      price: 300,
      quantity: 1,
      restaurant: 'Italiano',
      image: require('../../../assets/img/watch.png'),
    },
  ];

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 50;
  const discount = 0;
  const total = subTotal + deliveryCharge - discount;

  const handleQuantityChange = (id, change) => {
    // dispatch(updateQuantity({ id, change }));
  };

  const handleRemoveItem = id => {
    // dispatch(removeItem(id));
  };

  const handlePlaceOrder = () => {
    // dispatch(clearCart());
    // navigation.navigate('OrderCompleted');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={'Cart'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Order details</Text>

        
          <View style={styles.cartList}>
            {cartItems.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <View style={{justifyContent:'center'}}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {/* <Text style={styles.itemRestaurant}>{item.restaurant}</Text> */}
                      <Text style={styles.itemPrice}>Rs {item.price * item.quantity}</Text>
                    </View>
                  <View style={{justifyContent:'center'}} >
                   

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, -1)}
                    >
                    <Text>➖</Text>
                      {/* <RemoveSvg width={22} height={22} fill={colors.white} /> */}
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, 1)}
                    >
                      <Text>➕</Text>
                      {/* <PlusSvg width={22} height={22} fill={colors.white} /> */}
                    </TouchableOpacity>
                  </View>
                  </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
       

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

