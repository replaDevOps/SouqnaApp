import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getUserConversations, getUserInfo} from '../../../firebase/chatService';
import {formatDistanceToNow} from 'date-fns';
import styles from './styles';
import {mvs} from '../../../util/metrices';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import InboxSkeleton from './InboxSkeleton';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../components/CustomText';

const InboxScreen = () => {
  const navigation = useNavigation();
  const {token, id: userId, role} = useSelector(state => state.user);
  const {t} = useTranslation();

  const [searchText, setSearchText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [usersInfo, setUsersInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showLocationIcon, setShowLocationIcon] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    }, [userId, token]),
  );

  // Setup conversation listener function
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
                setConversations([]);
                setFilteredConversations([]);
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

              const userIdsToFetch = conversationsData
                .map(conv => conv.otherUserId)
                .filter(id => id && !usersInfo[id]);

              if (userIdsToFetch.length > 0) {
                const newUsersInfo = {};
                for (const id of userIdsToFetch) {
                  try {
                    const userInfo = await getUserInfo(id);
                    if (userInfo) newUsersInfo[id] = userInfo;
                  } catch (e) {
                    console.error(
                      `[InboxScreen] Error fetching user ${id}:`,
                      e,
                    );
                  }
                }

                if (Object.keys(newUsersInfo).length > 0) {
                  setUsersInfo(prev => ({...prev, ...newUsersInfo}));
                }
              }

              setConversations(conversationsData);
              setFilteredConversations(conversationsData);
              setIsLoading(false);
              resolve();
            } catch (innerError) {
              setIsLoading(false);
              reject(innerError);
            }
          },
          error => {
            console.error('Error getting conversations:', error);
            Alert.alert('Error', 'Failed to load conversations.');
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

  const onSearch = query => {};

  const handleClearText = () => {
    setSearchText('');
    setIsSearchMode(false);
    setShowLocationIcon(true);
  };

  const formatTimestamp = timestamp => {
    if (!timestamp || !timestamp.toDate) {
      return '';
    }

    try {
      return formatDistanceToNow(timestamp.toDate(), {addSuffix: true});
    } catch (error) {
      console.error('[InboxScreen] ❌ Error formatting timestamp:', error);
      return '';
    }
  };

  const refreshInbox = async () => {
    try {
      setRefreshing(true);
      await setupConversationListener();
    } catch (error) {
      console.error('Error refreshing inbox:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = useCallback(
    ({item}) => {
      const otherUser = usersInfo[item.otherUserId] || {};
      const unreadCount = item.userInfo?.[userId]?.unreadCount || 0;
      const lastMessage = item.lastMessage || {};

      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Chat', {
              conversationId: item.id,
              userName: otherUser.name || 'Chat',
              otherUserId: item.otherUserId,
            });
          }}
          style={styles.newMessageContainer}>
          <Image
            source={
              otherUser.profileImage
                ? {uri: otherUser.profileImage}
                : require('../../../assets/img/profile.png')
            }
            style={styles.profileImage}
          />

          <View style={styles.messageContentWrapper}>
            <View style={styles.messageTopRow}>
              <CustomText style={styles.senderName}>
                {otherUser.name || 'User'}
              </CustomText>

              <View style={styles.messageBody}>
                <CustomText style={styles.messageTime}>
                  {formatTimestamp(lastMessage.createdAt)}
                </CustomText>
              </View>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.messagePreviewContainer}>
                <CustomText style={styles.messageText} numberOfLines={1}>
                  {lastMessage.text || 'Start a conversation...'}
                </CustomText>
              </View>
              {unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                  <CustomText style={styles.unreadBadgeText}>
                    {unreadCount}
                  </CustomText>
                </View>
              ) : (
                ''
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation, usersInfo, userId],
  );

  const EmptyComponent = () => (
    <View style={styles.emptyInbox}>
      <Image
        source={require('../../../assets/img/empty.png')}
        style={{width: '90%', resizeMode: 'contain', height: mvs(200)}}
      />
      {/* <Bold style={styles.emptyCartText}>{t('empty')}</Bold> */}
      <CustomText style={styles.emptyInboxText}>
        {t('noTextReceived')}
      </CustomText>
    </View>
  );
  console.log('{FilteredConverations}', filteredConversations);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={{flex: 1, backgroundColor: '#fbfbfb', paddingBottom: mvs(40)}}>
        <MainHeader title={t('messages')} />
        {/* {filteredConversations.length > 0 ? ( */}
        <View style={styles.messagesWrapper}>
          <CustomText style={styles.header}>{t('messages')}</CustomText>

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
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshInbox}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        {/* // ) : ( */}
        {/* //   <View style={styles.emptyInbox}> */}
        {/* //     <Image */}
        {/* //       source={require('../../../assets/img/empty.png')}
        //       style={{width: '90%', resizeMode: 'contain', height: mvs(200)}}
        //     />
        //     {/* <Bold style={styles.emptyCartText}>{t('empty')}</Bold> */}
        {/* //     <CustomText style={styles.emptyInboxText}>No text recieved yet</CustomText>
        //   </View>
        // )
        } */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InboxScreen;
