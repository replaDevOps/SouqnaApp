import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import SearchHeader from '../../../Headers/SearchHeader';
import {useNavigation} from '@react-navigation/native';
import {mvs} from '../../../../util/metrices';
import {NotificationSVG} from '../../../../assets/svg';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function LogoHeader() {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const navigation = useNavigation();
  const {role} = useSelector(state => state.user);

  const onCancelSearch = () => {
    setIsSearchMode(false);
  };

  const onFocusSearch = () => {
    setIsSearchMode(true);
  };

  const onNotification = () => {
    navigation.navigate('BuyerNotification');
  };
  const navigateToSearchResults = () => {
    navigation.navigate('SearchResultsScreen');
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', elevation: 3}}>
      <View
        style={{
          // paddingTop: mvs(45),
          paddingBottom: mvs(4),
          backgroundColor: '#fff',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: mvs(12),
        }}>
        <Image
          source={require('../../../../assets/img/Souqna_Logo4.jpeg')}
          style={{width: mvs(145), height: mvs(28), resizeMode: 'contain'}}
        />
        {/* {role !== 2 && (
          <TouchableOpacity onPress={onNotification}>
            <NotificationSVG width={mvs(22)} height={mvs(22)} />
          </TouchableOpacity>
        )} */}
      </View>
    </SafeAreaView>
  );
}
