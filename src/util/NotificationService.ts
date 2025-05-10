// App.tsx or NotificationService.ts

import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

const useNotificationListener = () => {
  useEffect(() => {
    // 1. Foreground message listener
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground FCM data:', remoteMessage);

      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || 'Notification',
          remoteMessage.notification.body || '',
        );
      } else if (remoteMessage.data) {
        Alert.alert('Data Message', JSON.stringify(remoteMessage.data));
      }
    });

    // 2. Background + quit state message opened listener
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
      },
    );

    // 3. App opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          // Navigate based on data if needed
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);
};

export default useNotificationListener;
