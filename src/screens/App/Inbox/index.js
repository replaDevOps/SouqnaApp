/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getUserConversations, getUserInfo } from '../../../firebase/chatService';
import { formatDistanceToNow } from 'date-fns';
import SearchSVG from '../../../assets/svg/SearchSVG';
import {CloseSvg} from '../../../assets/svg';
import styles from './styles';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import InboxSkeleton from './InboxSkeleton';

const InboxScreen = () => {
  const navigation = useNavigation();
  const { token, id: userId, role } = useSelector(state => state.user);
  
  const [searchText, setSearchText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [usersInfo, setUsersInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showLocationIcon, setShowLocationIcon] = useState(true);

  // Load conversations
  useEffect(() => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = getUserConversations(
      userId,
      async (querySnapshot) => {
        const conversationsData = [];
        
        for (const doc of querySnapshot.docs) {
          const conversation = { id: doc.id, ...doc.data() };
          
          // Find the other user's ID
          const otherUserId = conversation.members.find(memberId => memberId !== userId);
          
          if (otherUserId && !usersInfo[otherUserId]) {
            try {
              // Fetch user info if not already in state
              const userInfo = await getUserInfo(otherUserId);
              if (userInfo) {
                setUsersInfo(prev => ({ ...prev, [otherUserId]: userInfo }));
              }
            } catch (error) {
              console.error('Error fetching user info:', error);
            }
          }
          
          conversationsData.push({
            ...conversation,
            otherUserId,
          });
        }
        
        setConversations(conversationsData);
        setFilteredConversations(conversationsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting conversations:', error);
        setIsLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [userId, token, usersInfo]);

  // Filter conversations based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredConversations(conversations);
      return;
    }
    
    const filtered = conversations.filter(conversation => {
      const otherUser = usersInfo[conversation.otherUserId];
      if (!otherUser) return false;
      
      const name = otherUser.name?.toLowerCase() || '';
      return name.includes(searchText.toLowerCase());
    });
    
    setFilteredConversations(filtered);
  }, [searchText, conversations, usersInfo]);

  const onFocusSearch = () => {
    setIsSearchMode(true);
    setShowLocationIcon(false);
  };

  const onSearch = query => {
    console.log('Searching for:', query);
  };

  const handleClearText = () => {
    setSearchText('');
    setIsSearchMode(false);
    setShowLocationIcon(true);
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return '';
    }
    
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  const renderItem = useCallback(({ item }) => {
    const otherUser = usersInfo[item.otherUserId] || {};
    const unreadCount = item.userInfo?.[userId]?.unreadCount || 0;
    const lastMessage = item.lastMessage || {};
    
    return (
      <TouchableOpacity
        onPress={() => 
          navigation.navigate('Chat', { 
            conversationId: item.id,
            userName: otherUser.name || 'Chat',
            otherUserId: item.otherUserId
          })
        }
        style={styles.messageContainer}>
        <View style={styles.messageHeader}>
          <Image
            source={
              otherUser.profileImage 
                ? { uri: otherUser.profileImage } 
                : require('../../../assets/img/profile.png')
            }
            style={styles.profileImage}
          />
          <View style={styles.messageHeaderInfo}>
            <Text style={styles.senderName}>{otherUser.name || 'User'}</Text>
            <Text style={styles.messageText} numberOfLines={1}>
              {lastMessage.text || 'Start a conversation...'}
            </Text>
          </View>
        </View>
        <View style={styles.messageBody}>
          <Text style={styles.messageTime}>
            {formatTimestamp(lastMessage.createdAt)}
          </Text>
          {unreadCount > 0 ? (
  <View style={styles.unreadBadge}>
    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
  </View>
) : null}
        </View>
      </TouchableOpacity>
    );
  }, [navigation, usersInfo, userId]);

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? 'Loading conversations...' : 'No conversations yet'}
      </Text>
      {/* {!isLoading && (
        <TouchableOpacity
          style={styles.startChatButton}
          onPress={() => navigation.navigate('SearchResultsScreen')}>
          <Text style={styles.startChatButtonText}>Find People to Chat With</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={{flex: 1, backgroundColor: '#fbfbfb', paddingBottom: mvs(40)}}>
      <MainHeader title={'Messages'} />
        
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TouchableOpacity style={styles.icon}>
            <SearchSVG width={22} height={22} fill={colors.grey} />
          </TouchableOpacity>

          <TextInput
            style={styles.searchBar}
            onFocus={onFocusSearch}
            placeholder={'Search here...'}
            placeholderTextColor={colors.grey}
            keyboardType="default"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => {
              if (searchText.trim() !== '') {
                onSearch(searchText);
              }
            }}
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={handleClearText}
              style={styles.notificationIcon}>
              <CloseSvg width={13} height={13} />
            </TouchableOpacity>
          )}
        </View>

        {/* Messages */}
        <View style={styles.messagesWrapper}>
          <Text style={styles.header}>Messages</Text>

          {isLoading ? (
            <InboxSkeleton count={5} />
          ) : (
            <FlatList
              data={filteredConversations}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListEmptyComponent={EmptyComponent}
              contentContainerStyle={{
                gap: 15,
                marginHorizontal: mvs(14),
                paddingBottom: mvs(100),
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InboxScreen;