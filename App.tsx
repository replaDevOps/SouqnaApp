import { useEffect, useState } from 'react';
import './src/i18n/i18n';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/StackNavigation/Navigation';
import { LogBox, PermissionsAndroid, View } from 'react-native';
import { persistor, store } from './src/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './src/i18n/i18n';
import messaging from '@react-native-firebase/messaging';
import useNotificationListener from './src/util/NotificationService';
import GlobalSnackbar from './src/components/Structure/GlobalSnackbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import React from 'react';

LogBox.ignoreAllLogs();

// Utility function to update font based on language
const updateAppFont = (language) => {
  const TextComponent = Text as any;
  if (TextComponent.defaultProps == null) TextComponent.defaultProps = {};
  TextComponent.defaultProps.allowFontScaling = false;
  TextComponent.defaultProps.style = {
    fontFamily: language === 'ar' ? 'Asal' : 'System',
  };
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  useNotificationListener();

  useEffect(() => {
    const requestUserPermission = async () => {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        await AsyncStorage.setItem('fcmToken', token);
      }
    };

    requestUserPermission();

    // Listen to token refresh
    const unsubscribe = messaging().onTokenRefresh(async newToken => {
      console.log('FCM Token refreshed:', newToken);
      await AsyncStorage.setItem('fcmToken', newToken);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      const currentLang = savedLang || i18n.language;

      if (savedLang && i18n.language !== savedLang) {
        await i18n.changeLanguage(savedLang);
      }

      // Set initial font
      updateAppFont(currentLang);
      setIsReady(true);
    };

    initLanguage();

    // Listen for language changes during runtime
    const handleLanguageChange = (lng) => {
      console.log('Language changed to:', lng);
      updateAppFont(lng);
    };

    // Subscribe to i18n language change events
    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup listener on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  if (!isReady) return null; // You can replace this with a splash screen

  const linking = {
    prefixes: ['myapp://', 'https://yourdomain.com'],
    config: {
      screens: {
        ProductDetail: 'product/:productId',
      },
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <NavigationContainer linking={linking}>
                <AppNavigator />
                <GlobalSnackbar />
              </NavigationContainer>
            </View>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;