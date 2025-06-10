import React from 'react';
import {View, FlatList, TouchableOpacity, StatusBar, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ForwardSVG} from '../../../assets/svg';
import styles from '../AdvertiseAll/style';

const SubCategoryMain = () => {
  const route = useRoute();
  const {category, subcategories, categoryId} = route.params;
  const navigation = useNavigation();

  const handleSubcategoryPress = subcategory => {
    console.log(`Advertise ${subcategory.name} clicked`);
    navigation.navigate('Products', {
      categoryId: categoryId,
      id: subcategory.id,
      name: subcategory.name,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };
  const renderSubCategoryItem = ({item}) => (
    <TouchableOpacity
      style={styles.subCategoryItem}
      onPress={() => handleSubcategoryPress(item)}>
      <View style={styles.titleContainer}>
        <Regular style={styles.subCategoryText}>{item.name}</Regular>
      </View>
      <ForwardSVG width={26} height={26} />
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
          data={subcategories}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={renderSubCategoryItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default SubCategoryMain;
