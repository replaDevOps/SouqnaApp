import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import {colors} from '../../../util/color';
import {useNavigation} from '@react-navigation/native';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import Notificationsvg from '../../../assets/svg/notification-svg';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../Notification/style';
import {useSelector} from 'react-redux';
import {fetchNotifications} from '../../../api/apiServices';
import {mvs} from '../../../util/metrices';
import Loader from '../../../components/Loader';

const Notification = () => {
  const navigation = useNavigation();
  const {token, role} = useSelector(state => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const {t} = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      const res = await fetchNotifications(token, role);
      if (res?.status === true && Array.isArray(res?.data)) {
        setNotifications(res.data);
      } else {
        console.warn('No notifications found or error occurred');
      }
      setLoading(false);
    };

    getNotifications();
  }, [token, role]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.notificationItem}>
        <TouchableOpacity style={styles.notificationIcon}>
          <Notificationsvg color={colors.green} />
        </TouchableOpacity>

        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CategoryHeader title={t('titleNotification')} onBack={handleBack} />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loader width={mvs(250)} height={mvs(250)} />
          {/* {/* <ActivityIndicator size="large" color={colors.green} /> */}
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={{
            ...styles.notificationContainer,
            flexGrow: 1,
            justifyContent:
              notifications.length === 0 ? 'center' : 'flex-start',
          }}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../../assets/img/empty.png')}
                style={{
                  width: '90%',
                  resizeMode: 'contain',
                  height: mvs(200),
                }}
              />
              <Text style={{textAlign: 'center', marginTop: mvs(20)}}>
                {t('No Notifications Found')}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Notification;
