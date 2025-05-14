import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import dummyData from '../../../util/dummyData';
import Regular from '../../../typography/RegularText';
import styles from './style';
import LocationSvg from '../../../assets/svg/location-svg';
import {ForwardSVG, OtherCategorySVG} from '../../../assets/svg';
import {Row} from '../../../components/atoms/row';
import { useTranslation } from 'react-i18next';

const AllCategories = () => {
  const navigation = useNavigation();
  const {categories, categoryIcons} = dummyData;
  const {t} = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCategoryPress = (category, subcategories) => {
    // If category has subcategories, navigate to subcategory screen
    if (subcategories) {
      navigation.navigate('SubCategoryScreen', {category, subcategories});
    } else {
      console.log(`Category ${category} clicked`);
    }
  };

  const renderCategoryItem = ({item}) => {
    const Icon = categoryIcons[item.name] || LocationSvg;
    return (
      <TouchableOpacity
        onPress={() => handleCategoryPress(item.name, item.subcategories)}>
        <View style={styles.categoryItem}>
          <View style={styles.IconContainer}>
            <Icon width={24} height={24} />
          </View>
          <Row style={styles.rowContainer}>
            <Regular style={styles.categoryText}>{item.name}</Regular>
            <ForwardSVG width={24} height={24} />
          </Row>
        </View>
      </TouchableOpacity>
    );
  };
  const otherCategories = categories.filter(
    category => category.name === 'Other Categories',
  );
  const filteredCategories = categories.filter(
    category => category.name !== 'Other Categories',
  );

  return (
    <View style={styles.container}>
      <CategoryHeader title={t('titleCategories')} onBack={handleBack} />

      {categories.at(4) && (
        <View style={styles.categoryItem}>
          <View style={styles.IconContainer}>
            <OtherCategorySVG width={24} height={24} />
          </View>
          <Regular style={styles.categoryText}>O{t('otherCategories')}</Regular>
        </View>
      )}

      <FlatList
        data={filteredCategories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
};

export default AllCategories;
