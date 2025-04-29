import React from 'react';
import {View, FlatList, Image, StatusBar} from 'react-native';
import dummyData from '../../../util/dummyData';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

const {newsData} = dummyData;

const NewsScreen = () => {
  const renderNewsItem = ({item}) => (
    <View style={styles.newsItem}>
      <Image source={item.imageUrl} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Bold style={styles.newsTitle}>{item.title}</Bold>
        <Regular style={styles.newsDescription}>{item.description}</Regular>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={'News'} />
      <FlatList
        data={newsData}
        keyExtractor={item => item.id}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.newsList}
      />
    </SafeAreaView>
  );
};

export default NewsScreen;
