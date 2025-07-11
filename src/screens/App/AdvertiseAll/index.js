import React from 'react';
import {View, FlatList, TouchableOpacity, StatusBar, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './style';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ForwardSVG, HOMESVG, ProfileSVG} from '../../../assets/svg';
import { useTranslation } from 'react-i18next';
import LocationSvg from '../../../assets/svg/location-svg';
import { colors } from '../../../util/color';

const AdvertiseAll = () => {
  const route = useRoute();
  const {category, subcategories, categoryId, categoryImage} = route.params;
  const navigation = useNavigation();
    const {t} = useTranslation();

  const handleSubcategoryPress = subcategory => {
    console.log(`Advertise ${subcategory.name} clicked`);
    navigation.navigate('CreateProduct', {
    categoryId: categoryId,
    id: subcategory.id,
    name: subcategory.name,
    category: category,
    categoryImage: categoryImage,
    subcategoryImage: subcategory.imageURL,
    subcategoryImageName: subcategory.imageName,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderSubCategoryItem = ({item}) => (

    <TouchableOpacity
      style={styles.subCategoryItem}
      onPress={() => handleSubcategoryPress(item)}>
  <View style={styles.IconContainer}>
    {item.imageURL ? (
      <Image
        source={{uri: item.imageURL}}
        style={{width: 50, height: 50, borderRadius: 25, marginTop: 20, resizeMode:'contain'}}
      />
    ) : (
      <ProfileSVG width={24} height={24} color={colors.green} />
    )}
  </View>
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
        <Regular style={styles.header}>{t('All')} {category}</Regular>
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
