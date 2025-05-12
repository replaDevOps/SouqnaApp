/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  IMessage,
  Bubble,
  Send,
  InputToolbar,
} from 'react-native-gifted-chat';
import {SafeAreaView, View, Text} from 'react-native';
import { UploadSVG } from '../../../assets/svg';
import { mvs } from '../../../util/metrices';

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: '2',
        text: 'Welcome to our chat support!',
        createdAt: new Date(Date.now() - 3600000),
        system: true,
      },
      {
        _id: '1',
        text: 'Hello! How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Support Agent',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );

    setTimeout(() => {
      const response: IMessage = {
        _id: Date.now().toString(),
        text: 'Thanks for your message. This is a simulated response.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Support Agent',
        },
      };
      setMessages(prev => GiftedChat.append(prev, [response]));
    }, 1000);
  }, []);

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#ADBDFE',
            padding: 8,
          },
          left: {
            backgroundColor: '#F0F0F0',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  const renderSend = props => {
    return (
      <Send {...props}>
        <View style={{backgroundColor:'#ADBD6E',paddingHorizontal:mvs(15),paddingVertical:mvs(10),borderRadius:mvs(5)}}>
          <Text style={{color:'#fff',fontWeight:'bold'}}>Send</Text>
        </View>
      </Send>
    );
  };

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        padding: 4,
      }}
    />
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
          name: 'User',
        }}
        placeholder="Type a message..."
        alwaysShowSend
        showUserAvatar
        renderUsernameOnMessage
        scrollToBottom
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
      />
    </SafeAreaView>
  );
};

export default Chat;
