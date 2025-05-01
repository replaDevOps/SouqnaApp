// CategoryList.js
import React, {memo} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Bold from '../../../../typography/BoldText';
import styles from './style';
import dummyData from '../../../../util/dummyData';
import {HOMESVG} from '../../../../assets/svg';

const {categoryIcons, categories} = dummyData;
const serverURL = 'https://backend.souqna.net';

const CategorySection = ({categories}) => {
  const navigation = useNavigation();

  const handleCategoryPress = (category, subcategories) => {
    if (category === 'Other Categories') {
      navigation.navigate('AllCategories');
    } else if (subcategories) {
      navigation.navigate('SubCategoryScreen', {category, subcategories});
    }
  };

  return (
    <View style={styles.categoryContainer}>
      <FlatList
        data={categories.slice(0, 5)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(category, index) => index.toString()}
        renderItem={({item}) => {
          const imageURL = item.image ? `${serverURL}${item.image}` : null;
          const Icon = categoryIcons[item.name] || HOMESVG;

          return (
            <TouchableOpacity
              onPress={() =>
                handleCategoryPress(item.name, item.subcategories)
              }>
              <View style={styles.categoryItem}>
                <View style={styles.IconContainer}>
                  {imageURL ? (
                    <Image
                      source={{uri: imageURL}}
                      style={{width: 24, height: 24}}
                    />
                  ) : (
                    <Icon width={24} height={24} />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Bold style={styles.categoryText}>{item.name}</Bold>
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

// export default CategorySection;
