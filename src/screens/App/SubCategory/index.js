import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './style';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {ForwardSVG} from '../../../assets/svg';

const SubCategoryScreen = () => {
  const route = useRoute();
  const {category, subcategories} = route.params;
  const navigation = useNavigation();

  const handleSubcategoryPress = subcategory => {
    console.log(`Subcategory ${subcategory} clicked`);
  };

  const handleBack = () => {
    navigation.goBack();
  };
  const renderSubCategoryItem = ({item}) => (
    <TouchableOpacity onPress={() => handleSubcategoryPress(item)}>
      <View style={styles.subCategoryItem}>
        <Regular style={styles.subCategoryText}>{item}</Regular>
        <ForwardSVG width={18} height={18} />
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSubCategoryItem}
        />
      </View>
    </View>
  );
};

export default SubCategoryScreen;
