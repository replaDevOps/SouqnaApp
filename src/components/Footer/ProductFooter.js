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
import {CallSVG, CartSVG, ChatSVG} from '../../assets/svg';

const ProductFooter = ({
  onBuyPress,
  onChatPress,
  onCallPress,
  loadingChat,
  loadingBuy,
  loadingCall,
  sellerPhone,
}) => {
  const [showBuy, setShowBuy] = useState(false);

  const handleCallPress = () => {
    if (sellerPhone) {
      Linking.openURL(`tel:${sellerPhone}`);
    } else {
      console.warn('Seller phone number not available');
    }
  };

  const handleBuyPress = () => {
    setShowBuy(true);
    onBuyPress && onBuyPress();
  };

 const role = 2;

  // Declare buttons based on role
  let buttons = [];

  if (role === 1) {
    buttons = [
      {
        key: 'chat',
        onPress: onChatPress,
        loading: loadingChat,
        text: 'Chat with Seller',
        Icon: ChatSVG,
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
        onPress: null,
        loading: loadingChat,
        text: 'Update Product',
        Icon: ChatSVG,
        // textclr:colors.black,
        // bgcolor:colors.lightorange
      },
      {
        key: 'delete',
        onPress: null,
        loading: loadingCall,
        text: 'Delete Product',
        Icon: CallSVG,
        // textclr:'rgba(240, 149, 3, 0.92)',
        // bgcolor:colors.red
      },
    ];
  }

  return (
    <View style={styles.footerContainer}>
      <View style={styles.buttonRow}>
        {buttons.map(({key, onPress, loading, text, Icon}) => (
          <TouchableOpacity key={key} style={[styles.buyButton]} onPress={onPress}>
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
