import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SearchSvg from '../../../assets/svg/SearchSVG';
import {CloseSvg} from '../../../assets/svg';
import styles from './styles';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import InboxSkeleton from './InboxSkeleton';

const dummyMessages = Array.from({length: 15}, (_, i) => ({
  id: i.toString(),
  name: `John Doe ${i + 1}`,
  message: `This is message number ${i + 1}`,
  time: '00:34 PM',
  unread: Math.floor(Math.random() * 100),
}));

const InboxScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showLocationIcon, setShowLocationIcon] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', {userName: item.name})}
      style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Image
          source={require('../../../assets/img/profile.png')}
          style={styles.profileImage}
        />
        <View style={styles.messageHeaderInfo}>
          <Text style={styles.senderName}>{item.name}</Text>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
      <View style={styles.messageBody}>
        <Text style={styles.messageTime}>{item.time}</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unread}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
            <SearchSvg width={22} height={22} fill={colors.grey} />
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
            // Use the new MessageSkeletonPlaceholder component
            <InboxSkeleton count={12} />
          ) : (
            <FlatList
              data={dummyMessages}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={{gap: 12}}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InboxScreen;
