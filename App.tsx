import  {useEffect, useState} from 'react';
import './src/i18n/i18n';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/StackNavigation/Navigation';
import {LogBox,  PermissionsAndroid, View} from 'react-native';
import {persistor, store} from './src/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './src/i18n/i18n';
import messaging from '@react-native-firebase/messaging';
import useNotificationListener from './src/util/NotificationService';
import GlobalSnackbar from './src/components/Structure/GlobalSnackbar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { Text } from 'react-native';


LogBox.ignoreAllLogs();

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

  // useEffect(() => {
  //   const initLanguage = async () => {
  //     const savedLang = await AsyncStorage.getItem('appLanguage');
  //     if (savedLang && i18n.language !== savedLang) {
  //       await i18n.changeLanguage(savedLang);
  //     }
  //     setIsReady(true);
  //   };

  //   initLanguage();
  // }, []);

useEffect(() => {
  const initLanguage = async () => {
    const savedLang = await AsyncStorage.getItem('appLanguage');
    if (savedLang && i18n.language !== savedLang) {
      await i18n.changeLanguage(savedLang);
    }

    // Set default font family based on language
    const TextComponent = Text as any;

    if (TextComponent.defaultProps == null) TextComponent.defaultProps = {};
    TextComponent.defaultProps.allowFontScaling = false;
    TextComponent.defaultProps.style = {
      fontFamily: (savedLang || i18n.language) === 'ar' ? 'Asal' : 'System',
    };

    setIsReady(true);
  };

  initLanguage();
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
          <GestureHandlerRootView style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
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
