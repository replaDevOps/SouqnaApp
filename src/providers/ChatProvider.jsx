import {createContext, useEffect, useState, useCallback, useRef} from 'react';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getUserConversations} from '../firebase/chatService';

export const ChatContext = createContext({
  unreadCount: 0,
  isLoading: true,
});

export const ChatProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);

  const unsubscribeRef = useRef(null);

  const {token, id: userId, role} = useSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      // Set up the listener
      setupConversationListener();

      // Clean up when the screen loses focus
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    }, [userId, token]),
  );

  const setupConversationListener = useCallback(async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setIsLoading(true);

    return new Promise((resolve, reject) => {
      try {
        const unsubscribe = getUserConversations(
          userId,
          async querySnapshot => {
            try {
              if (querySnapshot.empty) {
                setUnreadCount(0);
                setIsLoading(false);
                resolve();
                return;
              }

              const conversationsData = [];
              querySnapshot.forEach(doc => {
                const data = doc.data();
                const otherUserId = data.members.find(
                  memberId => memberId !== userId,
                );
                conversationsData.push({id: doc.id, ...data, otherUserId});
              });

              let totalUnreadCount = 0;

              conversationsData.forEach(conv => {
                totalUnreadCount += conv.userInfo?.[userId]?.unreadCount || 0;
              });

              setUnreadCount(totalUnreadCount);

              setIsLoading(false);
              resolve();
            } catch (innerError) {
              setIsLoading(false);
              reject(innerError);
            }
          },
          error => {
            console.error('Error getting conversations count:', error);
            Alert.alert(t('error'), t('failedToLoadConversations'));
            setIsLoading(false);
            reject(error);
          },
        );

        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        setIsLoading(false);
        reject(error);
      }
    });
  }, [userId, token]);

  return (
    <ChatContext.Provider value={{unreadCount, isLoading}}>
      {children}
    </ChatContext.Provider>
  );
};
