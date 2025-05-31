import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {mvs} from '../../util/metrices';
import {colors} from '../../util/color';
import {
  CallSVG,
  CartSVG,
  ChatSVG,
  ChatSVG2,
  TrashSVG,
  UpdateSVG,
} from '../../assets/svg';
import {useSelector} from 'react-redux';

const ProductFooter = ({
  onBuyPress,
  onChatPress,
  onCallPress,
  loadingChat,
  loadingBuy,
  loadingUpdate,
  loadingDelete,
  handleUpdatePress,
  handleDeletePress,
  loadingCall,
  sellerPhone,
  customProductLink
}) => {
  const [showBuy, setShowBuy] = useState(false);
  const {token, role} = useSelector(state => state.user);
  const handleCallPress = () => {
    if (sellerPhone) {
      Linking.openURL(`tel:${sellerPhone}`);
    } else {
      console.warn('Seller phone number not available');
    }
  };

// const onChatPress = () => {
//   const message = `Hello! I’m interested in this product! \n ${customProductLink}`;
//   // const url = `sms:${sellerPhone}?body=${encodeURIComponent(message)}`;
//   const url = `https://wa.me/${sellerPhone}?text=${message}`;

//   Linking.openURL(url).catch(err =>
//     console.error('Failed to open SMS app:', err),
//   );
// };

  const handleBuyPress = () => {
    setShowBuy(true);
    onBuyPress && onBuyPress();
  };

  // Declare buttons based on role
  let buttons = [];

  if (role === 3 || token === null) {
    buttons = [
      {
        key: 'chat',
        onPress: onChatPress,
        loading: loadingChat,
        text: 'Chat with Seller',
        Icon: ChatSVG2,
        // bgcolor:colors.lightgreen
      },
      {
        key: 'call',
        onPress: handleCallPress,
        loading: loadingCall,
        text: 'Call Seller',
        Icon: CallSVG,
        // bgcolor:colors.lightgreen
      },
    ];
  } else {
    buttons = [
      {
        key: 'update',
        onPress: handleUpdatePress,
        loading: loadingUpdate,
        text: 'Update Product',
        Icon: UpdateSVG,
        // textclr:colors.black,
        // bgcolor:colors.lightorange
      },
      {
        key: 'delete',
        onPress: handleDeletePress,
        loading: loadingDelete,
        text: 'Delete Product',
        Icon: TrashSVG,
        // textclr:'rgba(240, 149, 3, 0.92)',
        // bgcolor:colors.red
      },
    ];
  }

  return (
    <View style={styles.footerContainer}>
      <View style={styles.buttonRow}>
        {buttons.map(({key, onPress, loading, text, Icon}) => (
          <TouchableOpacity
            key={key}
            style={[styles.buyButton]}
            onPress={onPress}>
            <Icon width={24} height={24} />
            {loading ? (
              <ActivityIndicator size="small" color={colors.green} />
            ) : (
              <Text style={[styles.buttonText]}>{text}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProductFooter;

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: mvs(10),
    paddingTop: mvs(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: mvs(10),
  },
  buyButton: {
    flex: 1,
    paddingVertical: mvs(12),
    marginHorizontal: mvs(5),
    borderRadius: mvs(25),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.lightgreen,
  },
  buttonText: {
    color: colors.green,
    fontSize: mvs(16),
    marginLeft: mvs(10),
    fontWeight: 'bold',
  },
});
