import React, { useEffect } from 'react';
import {
  Button,
  Linking,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Share} from 'react-native';
import {
  WhatsappSVG,
  EmailSvg,
  ChatSVG,
  CopyLinkSVG,
  ChatSVG2,
} from '../../../assets/svg';
import styles from './style';
import Regular from '../../../typography/RegularText';
import Clipboard from '@react-native-clipboard/clipboard';

const ShareActions = ({productTitle, productLink, productId,onLinkGenerated}) => {
  if (!productId) {
    console.warn('Product ID is missing!');
    return null;
  }
  const appLink = `myapp://product/${productId}`;

   useEffect(() => {
    if (onLinkGenerated && typeof onLinkGenerated === 'function') {
      onLinkGenerated(appLink);
    }
  }, [appLink, onLinkGenerated]);
  

  const handleShareToWhatsApp = async () => {
    try {
      const message = `Check out this product: ${productTitle}. More details here: ${appLink}`;
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        ToastAndroid.show('WhatsApp not installed', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Error sharing to WhatsApp:', error);
    }
  };

  const handleShareToEmail = async () => {
    try {
      const message = `Check out this product: ${productTitle}. More details here: ${appLink}`;
      const url = `mailto:?subject=Check out this product&body=${encodeURIComponent(
        message,
      )}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        ToastAndroid.show('Email app not installed', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Error sharing via Email:', error);
    }
  };

  const handleShareToSMS = async () => {
    try {
      const message = `Check out this product: ${productTitle}. More details here: ${appLink}`;
      const url = `sms:?body=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        ToastAndroid.show('SMS app not installed', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Error sharing via SMS:', error);
    }
  };

  const handleCopyLink = () => {
    Clipboard.setString(appLink);
    ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
  };

  const handleShareProduct = async () => {
    try {
      const shareOptions = {
        title: 'Share Product',
        message: `Check out this product: ${productTitle}. More details here: ${appLink}`,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error sharing the product:', error);
    }
  };

  return (
    <View style={styles.shareContainer}>
      <Regular style={styles.shareTitle}>Share This Ad</Regular>
      <View style={styles.shareIconsRow}>
        <TouchableOpacity onPress={handleShareToWhatsApp}>
          <WhatsappSVG width={25} height={25} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareToEmail}>
          <EmailSvg width={30} height={30} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareToSMS}>
          <ChatSVG2 width={25} height={25} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCopyLink}>
          <CopyLinkSVG width={25} height={25} style={styles.shareIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleShareProduct}>
          <OpenSVG width={30} height={30} style={styles.shareIcon} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ShareActions;
