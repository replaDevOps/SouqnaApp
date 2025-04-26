import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './style';
import CategoryHeader from '../../../components/Headers/CategoryHeader';

const AdvertiseAll = () => {
  const route = useRoute();
  const {category, subcategories, categoryId} = route.params;
  const navigation = useNavigation();

  const handleSubcategoryPress = subcategory => {
    console.log(`Advertise ${subcategory.name} clicked`);
    navigation.navigate('CreateProduct', {
      categoryId: categoryId,
      id: subcategory.id,
      name: subcategory.name,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };
  const renderSubCategoryItem = ({item}) => (
    <TouchableOpacity onPress={() => handleSubcategoryPress(item)}>
      <View style={styles.subCategoryItem}>
        <Regular style={styles.subCategoryText}>{item.name}</Regular>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CategoryHeader title={category} onBack={handleBack} />
      <View style={styles.headerContainer}>
        <Regular style={styles.header}>All in {category}</Regular>
      </View>
      <View style={styles.content}>
        <FlatList
          data={subcategories}
          keyExtractor={item => item.id}
          renderItem={renderSubCategoryItem}
        />
      </View>
    </View>
  );
};

export default AdvertiseAll;
