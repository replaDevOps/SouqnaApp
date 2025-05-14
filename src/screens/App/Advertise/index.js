import React, {useEffect, useState} from 'react';
import {FlatList, Image, StatusBar, TouchableOpacity, View} from 'react-native';
import styles from './style';
import MainHeader from '../../../components/Headers/MainHeader';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useSelector} from 'react-redux';
import LocationSvg from '../../../assets/svg/location-svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {mvs} from '../../../util/metrices';
import Bold from '../../../typography/BoldText';
import {ForwardSVG} from '../../../assets/svg';

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
        const categoriesWithSubs = await Promise.all(
          res.data.data.map(async category => {
            try {
              const subRes = await axios.get(
                `${SERVER_URL}/api/getSubCategory/${category.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              return {
                ...category,
                hasSubcategories: subRes.data.data.length > 0,
              };
            } catch {
              return {
                ...category,
                hasSubcategories: false,
              };
            }
          }),
        );
        setCategories(categoriesWithSubs);
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = async (categoryName, categoryId, image) => {
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
          categoryImage: image,
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
    const imageURL = item.image ? `${SERVER_URL}${item.image}` : null;
    return (
      <TouchableOpacity
        onPress={() => handleCategoryPress(item.name, item.id, imageURL)}
        style={styles.categoryItem}>
        <View style={styles.IconContainer}>
          {imageURL ? (
            <Image
              source={{uri: imageURL}}
              style={{width: mvs(60), height: mvs(60)}}
            />
          ) : (
            <LocationSvg width={24} height={24} />
          )}
        </View>
        <View style={styles.rowContainer}>
          <Bold
            style={styles.categoryText}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.name}
          </Bold>
          {item.hasSubcategories && (
            <View style={{marginTop: mvs(5), alignItems: 'center'}}>
              {/* <ForwardSVG width={18} height={18} /> */}
            </View>
          )}
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

      <FlatList
        data={filteredCategories}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoryList}
      />
    </SafeAreaView>
  );
};

export default AdvertiseScreen;
