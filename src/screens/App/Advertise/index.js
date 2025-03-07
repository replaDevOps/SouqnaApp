import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import styles from './style';
import MainHeader from '../../../components/Headers/MainHeader';
import Regular from '../../../typography/RegularText';
import dummyData from '../../../util/dummyData';
import {useNavigation} from '@react-navigation/native';
import {Row} from '../../../components/atoms/row';
import {ForwardSVG} from '../../../assets/svg';

const AdvertiseScreen = () => {
  const {categories, categoryIcons} = dummyData;
  const navigation = useNavigation();

  const handleCategoryPress = (category, subcategories) => {
    // If category has subcategories, navigate to subcategory screen
    if (subcategories) {
      navigation.navigate('AdvertiseAll', {category, subcategories});
    } else {
      // Otherwise, just log or handle it in another way
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

  const filteredCategories = categories.filter(
    category => category.name !== 'Other Categories',
  );
  return (
    <View style={styles.container}>
      <MainHeader title="Post Ad" />
      <View style={styles.content}>
        <Regular style={styles.regularText}>Category Selection</Regular>
      </View>
      <FlatList
        data={filteredCategories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
};

export default AdvertiseScreen;
