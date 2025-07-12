/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ForwardSVG, ProfileSVG} from '../../../assets/svg';
import styles from '../AdvertiseAll/style';
import {fetchBuyerProducts} from '../../../api/apiServices';
import {colors} from '../../../util/color';
import {useTranslation} from 'react-i18next';
import i18n from '../../../i18n/i18n';

const SubCategoryMain = () => {
  const route = useRoute();
  const {category, subcategories, categoryId} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // 👈 Add loading state
  const {t} = useTranslation();

  const handleSubcategoryPress = async subcategory => {
    const isAllCategory = subcategory.id === null;

    if (isAllCategory) {
      try {
        setLoading(true);
        const filters = {
          category_id: categoryId,
        };

        const response = await fetchBuyerProducts(filters);

        if (response?.data?.length > 0) {
          // 🔽 Strictly filter on both categoryID and category name
          const parsedProducts = response.data.filter(
            p =>
              p.category?.id === categoryId &&
              p.category?.name?.toLowerCase() === category.toLowerCase(),
          );

          navigation.navigate('Products', {
            categoryId,
            id: null,
            name: `${t('all')} ${category}`,
            category,
            initialProducts: parsedProducts,
            subcategoryImage: subcategory.imageURL,
            subcategoryImageName: subcategory.imageName,
          });
          setTimeout(() => setLoading(false), 500);
        } else {
          console.log('No products found for this category.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch products for full category:', err);
        setLoading(false);
      }
    } else {
      navigation.navigate('Products', {
        categoryId,
        id: subcategory.id,
        name: getSubCategoryName(subcategory),
        category,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSubCategoryName = item => {
    return i18n.language === 'ar' ? item.ar_name : item.name;
  };

  const renderSubCategoryItem = ({item}) => (
    <TouchableOpacity
      style={styles.subCategoryItem}
      onPress={() => handleSubcategoryPress(item)}>
      <View style={styles.IconContainer}>
        {item.imageURL ? (
          <Image
            source={{uri: item.imageURL}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginTop: 20,
              resizeMode: 'contain',
            }}
          />
        ) : (
          <ProfileSVG width={24} height={24} color={colors.green} />
        )}
      </View>
      <View style={styles.subCategoryLeft}>
        <Regular style={styles.subCategoryText}>
          {getSubCategoryName(item)}
        </Regular>
      </View>
      <ForwardSVG width={26} height={26} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CategoryHeader title={category} onBack={handleBack} />
      <View style={styles.headerContainer}>
        <Regular style={styles.header}>
          {' '}
          {t(`all`)}
          {category}
        </Regular>
      </View>

      {loading ? ( // 👈 Show loader if loading
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={subcategories}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={renderSubCategoryItem}
            ListHeaderComponent={() => (
              <TouchableOpacity
                style={styles.subCategoryItem}
                onPress={() =>
                  handleSubcategoryPress({
                    id: null,
                    name: `${t('all')} ${category}`,
                    imageURL: null,
                    imageName: null,
                  })
                }>
                <View style={styles.titleContainer}>
                  <Regular style={styles.subCategoryText}>
                    {t(`all`)}
                    {category}
                  </Regular>
                </View>
                <ForwardSVG width={26} height={26} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SubCategoryMain;
