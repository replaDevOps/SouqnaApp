import React, {useEffect, useState} from 'react';
import './src/i18n/i18n';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/StackNavigation/Navigation';
import {LogBox, I18nManager} from 'react-native';
import {persistor, store} from './src/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './src/i18n/i18n';
import RNRestart from 'react-native-restart';
// import { firebase } from '@react-native-firebase/auth';

LogBox.ignoreAllLogs();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang && i18n.language !== savedLang) {
        const isRTL = savedLang === 'ar';

        if (I18nManager.isRTL !== isRTL) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          await AsyncStorage.setItem('appLanguage', savedLang);
          RNRestart.restart();
          return;
        }

        await i18n.changeLanguage(savedLang);
      }
      setIsReady(true);
    };

    initLanguage();
  }, []);

  if (!isReady) return null; // You can replace this with a splash screen

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
