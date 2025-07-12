import React, {memo, useState, useEffect} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import dummyData from '../../../../util/dummyData';
import {HOMESVG} from '../../../../assets/svg';
import CategorySkeleton from './CategorySkeleton';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import API, {
  BASE_URL_Product,
  fetchCategories,
} from '../../../../api/apiServices';
import {setCategories} from '../../../../redux/slices/categorySlice';
import {useTranslation} from 'react-i18next';
import i18n from '../../../../i18n/i18n';

const {categoryIcons} = dummyData;

const CategorySection = ({}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const categories = useSelector(state => state.category.categories);
  const SERVER_URL = {BASE_URL_Product};
  const {token} = useSelector(state => state.user);
  const {i18n} = useTranslation();
  const language = i18n.language;

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      const res = await fetchCategories(token);
      if (res?.success) {
        dispatch(setCategories(res.data));
        console.log('Setting Catewgories : ', res.data);
      } else {
        console.warn('Failed to fetch categories');
      }
      setIsLoading(false);
    };

    if (!categories || categories.length === 0) {
      loadCategories();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleCategoryPress = async (categoryName, categoryId) => {
    try {
      const res = await API.get(`getSubCategory/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const subcategories = res.data.data.map(sub => ({
          ...sub,
          imageURL: sub.image ? `${BASE_URL_Product}${sub.image}` : null,
          imageName: sub.imageName || null,
        }));
        console.log('Response of categories : ', res.data.data);
        navigation.navigate('SubCategoryMain', {
          category: categoryName,
          categoryId: categoryId,
          subcategories,
        });
        console.log(`Category ${categoryName} clicked`);
      } else {
        console.warn('No subcategories found');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error.message);
    }
  };

  if (isLoading) {
    return <CategorySkeleton />;
  }
  const getCategoryName = item => {
    return language === 'ar' ? item.ar_name : item.name;
  };

  return (
    <View style={styles.categoryContainer}>
      {/* Row 1 - Big Icons */}
      <View style={styles.row1}>
        {categories
          .filter(
            cat =>
              ['Vehicle', 'Property'].includes(cat.name) && cat.status === 1,
          )
          .map(item => {
            const imageURL = item.image
              ? `${BASE_URL_Product}${item.image}`
              : null;
            const Icon = categoryIcons[item.name] || HOMESVG;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.bigCard}
                onPress={() =>
                  handleCategoryPress(getCategoryName(item), item.id)
                }>
                <View style={styles.bigCardContent}>
                  <Text style={styles.categoryText}>
                    {getCategoryName(item)}
                  </Text>

                  {imageURL ? (
                    <Image source={{uri: imageURL}} style={styles.bigIcon} />
                  ) : (
                    <Icon width={60} height={60} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
      </View>

      {/* Row 2 - Small Icons */}
      <View style={styles.row}>
        {categories
          .filter(
            cat =>
              ['Services', 'New & Used', 'Spare Parts'].includes(cat.name) &&
              cat.status === 1,
          )
          .map(item => {
            const imageURL = item.image
              ? `${BASE_URL_Product}${item.image}`
              : null;
            const Icon = categoryIcons[item.name] || HOMESVG;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.smallCard}
                onPress={() =>
                  handleCategoryPress(getCategoryName(item), item.id)
                }>
                <View style={styles.textTop}>
                  <Text style={styles.categoryText}>
                    {getCategoryName(item)}
                  </Text>
                </View>
                <View style={styles.iconBottomFull}>
                  {imageURL ? (
                    <Image source={{uri: imageURL}} style={styles.smallIcon} />
                  ) : (
                    <Icon width={'100%'} height={40} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

// Memoize with custom comparison to prevent re-renders
export default memo(CategorySection, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.categories) ===
    JSON.stringify(nextProps.categories)
  );
});
