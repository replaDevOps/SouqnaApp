/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getUserConversations, getUserInfo } from '../../../firebase/chatService';
import { formatDistanceToNow } from 'date-fns';
import SearchSVG from '../../../assets/svg/SearchSVG';
import { CloseSvg } from '../../../assets/svg';
import styles from './styles';
import { colors } from '../../../util/color';
import { mvs } from '../../../util/metrices';
import MainHeader from '../../../components/Headers/MainHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Ref to store the listener unsubscribe function
  const unsubscribeRef = useRef(null);

  // Debug user state


  // This will run every time the screen comes into focus
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
    }, [userId, token])
  );

  // Setup conversation listener function
  const setupConversationListener = useCallback(() => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    // Clean up existing listener if any
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setIsLoading(true);

    try {
      const unsubscribe = getUserConversations(
        userId,
        async (querySnapshot) => {

          if (querySnapshot.empty) {
            setConversations([]);
            setFilteredConversations([]);
            setIsLoading(false);
            return;
          }

          // First, extract all conversations data
          const conversationsData = [];
          querySnapshot.forEach(doc => {
            const data = doc.data();
            const otherUserId = data.members.find(memberId => memberId !== userId);



            conversationsData.push({
              id: doc.id,
              ...data,
              otherUserId
            });
          });

          // Now, collect all the unique user IDs we need to fetch
          const userIdsToFetch = conversationsData
            .map(conv => conv.otherUserId)
            .filter(id => id && !usersInfo[id]);


          // Fetch all the user info in parallel
          if (userIdsToFetch.length > 0) {
            try {
              const newUsersInfo = {};

              // Fetch each user individually to handle errors better
              for (const id of userIdsToFetch) {
                try {
                  const userInfo = await getUserInfo(id);
                  if (userInfo) {
                    newUsersInfo[id] = userInfo;
                  } else {
                  }
                } catch (userError) {
                  console.error(`[InboxScreen] ❌ Error fetching user ${id}:`, userError);
                }
              }

              // Update the state with all the new user info at once
              if (Object.keys(newUsersInfo).length > 0) {
                setUsersInfo(prev => {
                  const combined = { ...prev, ...newUsersInfo };
                  return combined;
                });
              }
            } catch (error) {
              console.error('[InboxScreen] ❌ Error fetching user info:', error);
            }
          }

          // Set conversations state
          setConversations(conversationsData);
          setFilteredConversations(conversationsData);
          setIsLoading(false);
        },
        (error) => {
          console.error('[InboxScreen] ❌ Error getting conversations:', error);
          Alert.alert('Error', 'Failed to load conversations. Please try again.');
          setIsLoading(false);
        }
      );

      // Store the unsubscribe function in the ref
      unsubscribeRef.current = unsubscribe;

    } catch (error) {
      console.error('[InboxScreen] ❌ Exception setting up conversation listener:', error);
      setIsLoading(false);
    }
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
      console.error('[InboxScreen] ❌ Error formatting timestamp:', error);
      return '';
    }
  };

  const refreshInbox = () => {
    setupConversationListener();
  };

  const renderItem = useCallback(({ item }) => {
    const otherUser = usersInfo[item.otherUserId] || {};
    const unreadCount = item.userInfo?.[userId]?.unreadCount || 0;
    const lastMessage = item.lastMessage || {};


    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Chat', {
            conversationId: item.id,
            userName: otherUser.name || 'Chat',
            otherUserId: item.otherUserId
          });
        }}
        style={styles.newMessageContainer}
      >
        <Image
          source={
            otherUser.profileImage
              ? { uri: otherUser.profileImage }
              : require('../../../assets/img/profile.png')
          }
          style={styles.profileImage}
        />

        <View style={styles.messageContentWrapper}>
          <View style={styles.messageTopRow}>
            <Text style={styles.senderName}>{otherUser.name || 'User'}</Text>

            <View style={styles.messageBody}>
              {unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              ) : (
                <Text style={styles.messageTime}>
                  {formatTimestamp(lastMessage.createdAt)}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.messagePreviewContainer}>
            <Text style={styles.messageText} numberOfLines={1}>
              {lastMessage.text || 'Start a conversation...'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

    );
  }, [navigation, usersInfo, userId]);

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? 'Loading conversations...' : 'No conversations yet'}
      </Text>
      {!isLoading && (
        <TouchableOpacity
          style={styles.startChatButton}
          onPress={refreshInbox}>
          <Text style={styles.startChatButtonText}>Refresh Inbox</Text>
        </TouchableOpacity>
      )}
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={{ flex: 1, backgroundColor: '#fbfbfb', paddingBottom: mvs(40) }}>
        <MainHeader title={'Messages'} />

        {/* Search Bar */}
        {/* <View style={styles.searchBarContainer}>
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
        </View> */}


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