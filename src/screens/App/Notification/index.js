import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StatusBar} from 'react-native';
import {colors} from '../../../util/color';
import {useNavigation} from '@react-navigation/native';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import Notificationsvg from '../../../assets/svg/notification-svg';
import dummyData from '../../../util/dummyData';
import styles from './style';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const Notification = () => {
  const navigation = useNavigation();
  const {notificationsData} = dummyData;
  const {t} = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

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

      <FlatList
        data={notificationsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notificationContainer}
      />
    </SafeAreaView>
  );
};

export default Notification;
