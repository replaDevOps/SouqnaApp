import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Actions,
  Composer,
  MessageImage,
} from 'react-native-gifted-chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {mvs} from '../../../util/metrices';
import PlusSvg from '../../../assets/svg/plussvg';
import {colors} from '../../../util/color';
import {
  getMessages,
  sendMessage,
  getUserInfo,
  markConversationAsRead,
} from '../../../firebase/chatService'; // Removed markConversationAsRead
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {app} from '../../../firebase';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

const Chat = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {conversationId, otherUserId, userName, productInfo} =
    route.params || {};
  const {
    token,
    id: userId,
    name: currentUserName,
  } = useSelector(state => state.user);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const {t} = useTranslation();

  // Only need to track the messages listener
  const messagesListenerRef = useRef(null);

  // Set the chat screen title with product name instead of user name
  useEffect(() => {
    if (productInfo && productInfo.name) {
      navigation.setOptions({
        title: `${t('chatAboutProduct')} ${productInfo.name}`,
      });
    } else if (userName) {
      navigation.setOptions({
        title: t('Message'),
      });
    }
  }, [navigation, userName, productInfo]);

  // Mark conversation as read when chat is opened
  useEffect(() => {
    if (conversationId && userId) {
      // Call the markConversationAsRead function when the chat is opened
      try {
        markConversationAsRead(conversationId, userId);
        console.log(
          `Conversation ${conversationId} marked as read for user ${userId}`,
        );
      } catch (error) {
        console.error('Error marking conversation as read:', error);
      }
    }
  }, [conversationId, userId]);

  // Set up messages listener
  useEffect(() => {
    if (!conversationId || !userId || !token) {
      setIsLoading(false);
      return;
    }

    console.log(
      `Setting up messages listener for conversation: ${conversationId}`,
    );

    // Subscribe to messages - get all messages at once instead of paginating
    const unsubscribe = getMessages(
      conversationId,
      querySnapshot => {
        const messagesData = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const createdAt = firebaseData.createdAt
            ? firebaseData.createdAt.toDate()
            : new Date();

          return {
            _id: doc.id,
            text: firebaseData.text || '',
            createdAt,
            user: {
              _id: firebaseData.user._id,
              name: firebaseData.user.name || 'User',
            },
            image: firebaseData.image || undefined,
            product: firebaseData.product || undefined,
          };
        });

        const sortedMessages = messagesData.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );

        setMessages(sortedMessages);
        setIsLoading(false);
      },

      null,
      1000,
    );

    messagesListenerRef.current = unsubscribe;

    return () => {
      if (messagesListenerRef.current) {
        messagesListenerRef.current();
      }
    };
  }, [conversationId, userId, token]);

  useEffect(() => {
    const sendProductInfoMessage = async () => {
      if (productInfo && !isLoading) {
        try {
          const productMessage = {
            _id: new Date().getTime().toString(),
            createdAt: new Date(),
            user: {
              _id: userId,
              name: currentUserName || 'User',
            },
            text: `${t('chatInterestedInProduct')} ${productInfo.name}`,
            product: productInfo,
          };

          await sendMessage(conversationId, productMessage);
          console.log('Product info message sent');
        } catch (error) {
          console.error('Error sending product info message:', error);
        }
      }
    };

    const timer = setTimeout(sendProductInfoMessage, 1000);
    return () => clearTimeout(timer);
  }, [productInfo, isLoading, conversationId, userId, currentUserName]);

  const onSend = useCallback(
    async (newMessages = []) => {
      if (!conversationId || !userId || !token || newMessages.length === 0) {
        return;
      }

      const messageToSend = newMessages[0];

      if (!messageToSend.text || messageToSend.text.trim() === '') {
        return;
      }

      try {
        // Optimistically update UI before Firebase confirms
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessages),
        );

        await sendMessage(conversationId, {
          ...messageToSend,
          user: {
            _id: userId,
            name: currentUserName || 'User',
          },
        });

        // Message will be added via the Firestore listener
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', t('chatErrorSendFailed'));
      }
    },
    [conversationId, userId, token, currentUserName],
  );

  const uploadImage = async uri => {
    try {
      setIsUploading(true);

      // Create a reference to Firebase Storage
      const storage = getStorage(app);
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(
        storage,
        `chat_images/${conversationId}/${filename}`,
      );

      // Convert image uri to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      setIsUploading(false);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      Alert.alert('Error', t('chatErrorUploadFailed'));
      return null;
    }
  };

  const pickImage = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageUrl = await uploadImage(asset.uri);

        if (imageUrl) {
          const imageMessage = {
            _id: new Date().getTime().toString(),
            createdAt: new Date(),
            user: {_id: userId, name: currentUserName || 'User'},
            image: imageUrl,
          };

          await sendMessage(conversationId, imageMessage);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', t('chatErrorSelectImageFailed'));
    }
  }, [conversationId, userId, currentUserName]);

  // Custom rendering for product messages
  const renderCustomView = props => {
    const {currentMessage} = props;
    if (currentMessage.product) {
      return (
        <View style={styles.productContainer}>
          {currentMessage.product.image && (
            <Image
              source={{uri: currentMessage.product.image}}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {currentMessage.product.name}
            </Text>
            <Text style={styles.productPrice}>
              $ {Number(currentMessage.product.price).toLocaleString()}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#008e91',
          padding: mvs(2),
          marginRight: mvs(0),
        },
        left: {
          backgroundColor: '#F0F0F0',
          padding: mvs(2),
          marginLeft: mvs(4),
        },
      }}
      textStyle={{
        right: {color: '#fff', fontSize: 17},
        left: {color: '#000', fontSize: 17},
      }}
    />
  );

  const renderMessageImage = props => {
    return (
      <MessageImage
        {...props}
        imageStyle={{
          width: 200,
          height: 200,
          borderRadius: 10,
          margin: 3,
        }}
      />
    );
  };

  const renderSend = props => (
    <Send
      {...props}
      disabled={isUploading}
      containerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: mvs(5),
        marginBottom: Platform.OS === 'ios' ? mvs(5) : 0,
      }}>
      <View
        style={{
          backgroundColor: isUploading ? colors.grey : '#008e91',
          paddingHorizontal: mvs(15),
          paddingVertical: mvs(10),
          borderRadius: mvs(5),
        }}>
        {isUploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{color: '#fff', fontWeight: 'bold'}}>
            {t('chatSend')}
          </Text>
        )}
      </View>
    </Send>
  );

  const renderActions = props => (
    <Actions
      {...props}
      containerStyle={{
        width: 45,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: mvs(3),
        marginLeft: mvs(10),
        marginBottom: Platform.OS === 'ios' ? mvs(5) : 0,
      }}
      icon={() => <PlusSvg width={22} height={22} fill={'#008e91'} />}
      onPressActionButton={pickImage}
      options={{}}
    />
  );

  const renderComposer = props => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: mvs(20),
        paddingHorizontal: mvs(15),
        paddingVertical: Platform.OS === 'ios' ? mvs(10) : mvs(5),
        marginLeft: mvs(10),
        marginRight: mvs(10),
        marginBottom: Platform.OS === 'ios' ? mvs(5) : 0,
      }}
      placeholderTextColor="#999"
    />
  );

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        paddingTop: mvs(5),
        paddingBottom: mvs(8),
        paddingHorizontal: mvs(5),
      }}
    />
  );

  const renderLoading = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#008e91" />
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {isLoading ? (
        renderLoading()
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
          <GiftedChat
            messages={messages}
            onSend={msgs => onSend(msgs)}
            user={{
              _id: userId,
              name: currentUserName || 'User',
            }}
            placeholder={t('chatPlaceholder')}
            alwaysShowSend
            showUserAvatar={false}
            renderAvatar={null} // Hide avatars
            renderAvatarOnTop={false} // Hide avatars
            renderUsernameOnMessage={false} // Hide usernames
            scrollToBottom
            scrollToBottomStyle={{backgroundColor: colors.gray}}
            isTyping={false} // Disable typing indicator
            renderBubble={renderBubble}
            renderSend={renderSend}
            // renderActions={renderActions}
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            renderCustomView={renderCustomView}
            // renderMessageImage={renderMessageImage}
            timeFormat="HH:mm"
            dateFormat="MMM D"
          />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 8,
    marginBottom: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  productInfo: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  productPrice: {
    marginTop: 4,
    fontSize: 12,
    color: '#008e91',
  },
});

export default Chat;
