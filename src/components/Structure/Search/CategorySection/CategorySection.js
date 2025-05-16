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

const {categoryIcons} = dummyData;

const CategorySection = ({}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const categories = useSelector(state => state.category.categories);
  const SERVER_URL = {BASE_URL_Product};
  const {token} = useSelector(state => state.user);

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
        const subcategories = res.data.data;
        console.log('Response of categories : ', res.data.data);
        navigation.navigate('SubCategoryMain', {
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

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <View style={styles.categoryContainer}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(category, index) => index.toString()}
        renderItem={({item}) => {
          const imageURL = item.image
            ? `${BASE_URL_Product}${item.image}`
            : null;
          const Icon = categoryIcons[item.name] || HOMESVG;

          return (
            <TouchableOpacity
              onPress={() => handleCategoryPress(item.name, item.id)}>
              <View style={styles.categoryItem}>
                {imageURL ? (
                  <Image
                    source={{uri: imageURL}}
                    style={styles.IconContainer}
                  />
                ) : (
                  <Icon width={24} height={24} />
                )}
                <View style={styles.textContainer}>
                  <Text
                    style={styles.categoryText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
