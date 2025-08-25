// appInit.js
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import i18n from 'i18next';

export async function initApp() {
  try {
    const savedLang = await AsyncStorage.getItem('appLanguage');
    const appLang = savedLang || 'en';
    // Make sure i18n uses appLang
    i18n.changeLanguage(appLang);

    const shouldBeRTL = appLang === 'ar';
    // If the current RTL state doesn't match desired, set and restart
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
      // Must restart JS/native for changes to apply
      RNRestart.Restart();
    }
  } catch (e) {
    console.warn('initApp error', e);
  }
}
