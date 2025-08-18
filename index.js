/**
 * @format
 */

import {AppRegistry, I18nManager} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import {initApp} from './appInit';

// Force left-to-right
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

initApp()
  .then(() => console.log('App initialized successfully'))
  .catch(err => console.error('App initialization failed:', err));

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
