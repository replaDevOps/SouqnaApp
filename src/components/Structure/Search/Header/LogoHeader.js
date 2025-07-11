/* eslint-disable react-native/no-inline-styles */
import {Image, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {mvs} from '../../../../util/metrices';
import {SafeAreaView} from 'react-native-safe-area-context';
import { colors } from '../../../../util/color';
import { HeartSVG, NotificationSVG } from '../../../../assets/svg';

export default function LogoHeader({showFavIcon = false, onNotification}) {
  const navigation = useNavigation();

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
          source={require('../../../../assets/img/Souqna_Logo3.png')}
          style={{width: mvs(145), height: mvs(28), resizeMode: 'contain'}}
        />
                <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 'auto',
          }}>
              {showFavIcon && (
<TouchableOpacity onPress={() => navigation.navigate('Favourite')}
              style={{marginRight: mvs(12)}}>
          <HeartSVG color={colors.green} width={mvs(22)} height={mvs(22)} />
        </TouchableOpacity>
      )}
          {/* <TouchableOpacity onPress={() => navigation.navigate('BuyerNotification')}>
            <NotificationSVG width={mvs(22)} height={mvs(22)} />
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
