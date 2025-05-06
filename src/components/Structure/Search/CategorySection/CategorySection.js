import React, { memo, useState, useEffect } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import dummyData from '../../../../util/dummyData';
import { HOMESVG } from '../../../../assets/svg';
import CategorySkeleton from './CategorySkeleton';

const { categoryIcons, categories } = dummyData;
const serverURL = 'https://backend.souqna.net';

const CategorySection = ({ categories }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryPress = (category, subcategories) => {
    if (category === 'Other Categories') {
      navigation.navigate('AllCategories');
    } else if (subcategories) {
      navigation.navigate('SubCategoryScreen', { category, subcategories });
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
        renderItem={({ item }) => {
          const imageURL = item.image ? `${serverURL}${item.image}` : null;
          const Icon = categoryIcons[item.name] || HOMESVG;

          return (
            <TouchableOpacity
              onPress={() =>
                handleCategoryPress(item.name, item.subcategories)
              }>
              <View style={styles.categoryItem}>
                {imageURL ? (
                  <Image
                    source={{ uri: imageURL }}
                    style={styles.IconContainer}
                  />
                ) : (
                  <Icon width={24} height={24} />
                )}
                <View style={styles.textContainer}>
                  <Text
                    style={styles.categoryText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
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