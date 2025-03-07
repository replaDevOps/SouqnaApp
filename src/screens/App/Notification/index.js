import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {colors} from '../../../util/color';
import {useNavigation} from '@react-navigation/native';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import Notificationsvg from '../../../assets/svg/notification-svg';
import dummyData from '../../../util/dummyData';
import styles from './style';

const Notification = () => {
  const navigation = useNavigation();
  const {notificationsData} = dummyData;

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
    <View style={styles.container}>
      <CategoryHeader title={'Notification'} onBack={handleBack} />

      <FlatList
        data={notificationsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notificationContainer}
      />
    </View>
  );
};

export default Notification;
