import React, {useEffect, useState} from 'react';
import {FlatList, Image, StatusBar, TouchableOpacity, View} from 'react-native';
import styles from './style';
import MainHeader from '../../../components/Headers/MainHeader';
import Regular from '../../../typography/RegularText';
import {useNavigation} from '@react-navigation/native';
import {Row} from '../../../components/atoms/row';
import {ForwardSVG} from '../../../assets/svg';
import axios from 'axios';
import {useSelector} from 'react-redux';
import LocationSvg from '../../../assets/svg/location-svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { mvs } from '../../../util/metrices';

const SERVER_URL = 'https://backend.souqna.net';
const AdvertiseScreen = () => {
  // const {categories, categoryIcons} = dummyData;
  const [categories, setCategories] = useState([]);
  const {token} = useSelector(state => state.user);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/viewCategories`, {
        headers: {
          Authorization: {token},
        },
      });

      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = async (categoryName, categoryId) => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/getSubCategory/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        const subcategories = res.data.data;
        navigation.navigate('AdvertiseAll', {
          category: categoryName,
          categoryId: categoryId,
          subcategories,
        });
      } else {
        console.warn('No subcategories found');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error.message);
    }
  };

  const renderCategoryItem = ({item}) => {
    // const Icon = categoryIcons[item.name] || LocationSvg;
    const imageURL = item.image ? `${SERVER_URL}${item.image}` : null;
    return (
      <TouchableOpacity onPress={() => handleCategoryPress(item.name, item.id)}>
        <View style={styles.categoryItem}>
          <View style={styles.IconContainer}>
            {imageURL ? (
              <Image
                source={{uri: imageURL}}
                style={{width: mvs(40), height: mvs(40)}}
              />
            ) : (
              <LocationSvg width={24} height={24} />
            )}
          </View>
          <Row style={styles.rowContainer}>
            <Regular style={styles.categoryText}>{item.name}</Regular>
            <ForwardSVG width={24} height={24} />
          </Row>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredCategories = categories.filter(
    category => category.name !== 'Other Categories',
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={t('postAd')} />
      <View style={styles.content}>
        <Regular style={styles.regularText}>{t('categorySelection')}</Regular>
      </View>
      <FlatList
        data={filteredCategories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoryList}
      />
    </SafeAreaView>
  );
};

export default AdvertiseScreen;
