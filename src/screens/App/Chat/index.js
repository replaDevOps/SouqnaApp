/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  // Track if the device has a keyboard that floats over content vs pushes content
  const [keyboardFloating, setKeyboardFloating] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hello! How can I help you today?',
        timestamp: new Date(),
        isUser: false,
      },
      {
        id: '2',
        text: 'Welcome to our chat support!',
        timestamp: new Date(Date.now() - 3600000),
        isSystem: true,
      },
    ]);

    // Set up keyboard event listeners
    const keyboardWillShowListener =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillShow', detectKeyboardBehavior)
        : null;

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      detectKeyboardBehavior,
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      },
    );

    return () => {
      if (keyboardWillShowListener) {
        keyboardWillShowListener.remove();
      }
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Function to detect keyboard behavior and determine if it's floating or pushing content
  const detectKeyboardBehavior = e => {
    const keyboardHeight = e.endCoordinates.height;
    setKeyboardHeight(keyboardHeight);
    setKeyboardVisible(true);

    // Determine if keyboard is floating or pushing content based on platform and version
    // This is a simple check - in a production app you might need more sophisticated detection
    if (Platform.OS === 'android') {
      // Most modern Android devices float the keyboard over content
      setKeyboardFloating(true);
    } else {
      // iOS typically pushes content up
      setKeyboardFloating(false);
    }

    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({animated: true});
      }, 100);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');

    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message. This is a simulated response.',
        timestamp: new Date(),
        isUser: false,
      };

      setMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 1000);
  };

  const renderMessage = ({item}) => {
    if (item.isSystem) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.isUser
            ? styles.userMessageContainer
            : styles.agentMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            item.isUser ? styles.userMessageBubble : styles.agentMessageBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              item.isUser ? styles.userMessageText : styles.agentMessageText,
            ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={['top']}>
      <View style={styles.container}>
        {/* For floating keyboards (mostly Android), we need a dynamic margin */}
        <View
          style={[
            styles.messagesContainer,
            // Only adjust bottom margin for floating keyboards
            keyboardFloating && keyboardVisible
              ? {marginBottom: keyboardHeight}
              : {marginBottom: 70},
          ]}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messageList}
          />
        </View>

        {/* For pushing keyboards (mostly iOS), use KeyboardAvoidingView */}
        {!keyboardFloating ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <View style={styles.inputContainerWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type a message..."
                  placeholderTextColor="#999"
                  multiline
                  maxHeight={80}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendMessage}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          /* For floating keyboards, use absolute positioning with bottom offset */
          <View
            style={[
              styles.inputContainerWrapperFloating,
              {bottom: keyboardVisible ? keyboardHeight : 0},
            ]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                multiline
                maxHeight={80}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  messagesContainer: {
    flex: 1,
    // Fixed bottom margin to account for input container height
  },
  keyboardAvoidingView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  messageList: {
    padding: 10,
    paddingBottom: 40,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  agentMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  userMessageBubble: {
    backgroundColor: '#ADBD6E',
    borderBottomRightRadius: 5,
  },
  agentMessageBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  agentMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
    marginHorizontal: 5,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#9E6900',
    backgroundColor: '#FFEACA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputContainerWrapper: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    backgroundColor: '#FFFFFF',
    // No absolute positioning or bottom value - KeyboardAvoidingView handles this
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#ADBD6E',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Chat;
