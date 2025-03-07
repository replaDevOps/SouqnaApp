import React from 'react';
import {
  Clipboard,
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
  OpenSVG,
} from '../../../assets/svg';
import styles from './style';
import Regular from '../../../typography/RegularText';

const ShareActions = ({productTitle, productLink}) => {
  const handleShareToWhatsApp = async () => {
    try {
      const message = `Check out this product: ${productTitle}. More details here: ${productLink}`;
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);

        ToastAndroid.show('WhatsApp not installed', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Error sharing to WhatsApp:', error);
    }
  };

  const handleShareToEmail = async () => {
    try {
      const message = `Check out this product: ${productTitle}. More details here: ${productLink}`;
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
      const message = `Check out this product: ${productTitle}. More details here: ${productLink}`;
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
    Clipboard.setString(productLink);
    ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
  };

  const handleShareProduct = async () => {
    try {
      const shareOptions = {
        title: 'Share Product',
        message: `Check out this product: ${productTitle}. More details here: ${productLink}`,
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
          <WhatsappSVG width={30} height={30} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareToEmail}>
          <EmailSvg width={30} height={30} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareToSMS}>
          <ChatSVG width={30} height={30} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCopyLink}>
          <CopyLinkSVG width={30} height={30} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareProduct}>
          <OpenSVG width={30} height={30} style={styles.shareIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShareActions;
