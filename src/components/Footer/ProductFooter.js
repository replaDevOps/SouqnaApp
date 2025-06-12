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
import {CallSVG, ChatSVG2, TrashSVG, UpdateSVG} from '../../assets/svg';
import {useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';

const ProductFooter = ({
  onBuyPress,
  onChatPress,
  loadingChat,
  loadingUpdate,
  loadingDelete,
  handleUpdatePress,
  handleDeletePress,
  loadingCall,
  sellerPhone,
  productOwnerId,
}) => {
  const [showBuy, setShowBuy] = useState(false);
  const {token, role, id: userId} = useSelector(state => state.user);
  const isOwner = userId === productOwnerId; // or compare emails if needed
  const {t} = useTranslation();

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

  // Declare buttons based on role
  let buttons = [];

  if (!token || (role === 3 && !isOwner)) {
    buttons.push(
      {
        key: 'chat',
        onPress: onChatPress,
        loading: loadingChat,
        text: 'Chat with Seller',
        Icon: ChatSVG2,
      },
      {
        key: 'call',
        onPress: handleCallPress,
        loading: loadingCall,
        text: 'Call Seller',
        Icon: CallSVG,
      },
    );
  }

  if (role === 2 || isOwner) {
    buttons.push(
      {
        key: 'update',
        onPress: handleUpdatePress,
        loading: loadingUpdate,
        text: t('updateProduct'),
        Icon: UpdateSVG,
      },
      {
        key: 'delete',
        onPress: handleDeletePress,
        loading: loadingDelete,
        text: t('deleteProduct'),
        Icon: TrashSVG,
      },
    );
  }
  if (role === 3 && isOwner) {
    return null; // Hide footer entirely
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
