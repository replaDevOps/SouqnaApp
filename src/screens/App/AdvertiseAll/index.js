import React from 'react';
import {View, FlatList, TouchableOpacity, StatusBar} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './style';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ForwardSVG} from '../../../assets/svg';

const AdvertiseAll = () => {
  const route = useRoute();
  const {category, subcategories, categoryId, categoryImage} = route.params;
  const navigation = useNavigation();

  const handleSubcategoryPress = subcategory => {
    console.log(`Advertise ${subcategory.name} clicked`);
    navigation.navigate('CreateProduct', {
      categoryId: categoryId,
      id: subcategory.id,
      name: subcategory.name,
      category: category,
      categoryImage: categoryImage,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderSubCategoryItem = ({item}) => (
    <TouchableOpacity
      style={styles.subCategoryItem}
      onPress={() => handleSubcategoryPress(item)}>
      <View style={styles.subCategoryLeft}>
        <Regular style={styles.subCategoryText}>{item.name}</Regular>
      </View>
      <ForwardSVG width={22} height={22} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CategoryHeader title={category} onBack={handleBack} />
      <View style={styles.headerContainer}>
        <Regular style={styles.header}>All {category}</Regular>
      </View>
      <View style={styles.content}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={subcategories}
          keyExtractor={item => item.id.toString()}
          renderItem={renderSubCategoryItem}
          contentContainerStyle={styles.content}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdvertiseAll;
