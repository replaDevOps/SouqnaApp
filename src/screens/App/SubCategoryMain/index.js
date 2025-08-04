import React, {useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ForwardSVG} from '../../../assets/svg';
import styles from '../AdvertiseAll/style';
import {fetchBuyerProducts} from '../../../api/apiServices';
import i18n from '../../../i18n/i18n';
import {t} from 'i18next';
import Loader from '../../../components/Loader';
import {mvs} from '../../../util/metrices';
import {BASE_URL_Product} from '../../../api/apiServices';

const SubCategoryMain = () => {
  const route = useRoute();
  const {category, subcategories, categoryId} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const getLocalizedName = item =>
    i18n.language === 'ar' ? item.ar_name || item.name : item.name;

  const localizedCategory =
    typeof category === 'object' ? getLocalizedName(category) : category;

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
          // const parsedProducts = response.data.filter(
          //   p =>
          //     p.category?.id === categoryId &&
          //     p.category?.name?.toLowerCase() ===
          //       (category.name || category).toLowerCase(),
          // );
          const parsedProducts = response.data.filter(
            p => p.category?.id === categoryId,
          );

          console.log('PARSED PRODUCTS: ', parsedProducts);
          navigation.navigate('Products', {
            categoryId,
            id: null,
            name: `${t('all')} ${localizedCategory}`,
            category,
            initialProducts: parsedProducts,
          });
        } else {
          console.log('No products found for this category.');
        }
      } catch (err) {
        console.error('Failed to fetch products for full category:', err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    } else {
      navigation.navigate('Products', {
        categoryId,
        id: subcategory.id,
        name: getLocalizedName(subcategory),
        category,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderSubCategoryItem = ({item}) => {
    const imageURL = item.image ? `${BASE_URL_Product}${item.image}` : null;

    return (
      <TouchableOpacity
        style={styles.subCategoryItem}
        onPress={() => handleSubcategoryPress(item)}>
        <View style={styles.IconContainer}>
          {imageURL && (
            <Image
              source={{uri: imageURL}}
              style={{width: mvs(60), height: mvs(60), resizeMode: 'contain'}}
            />
          )}
        </View>
        <View style={styles.titleContainer}>
          <Regular style={styles.subCategoryText}>
            {getLocalizedName(item)}
          </Regular>
        </View>
        <ForwardSVG width={26} height={26} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CategoryHeader title={localizedCategory} onBack={handleBack} />
      <View style={styles.headerContainer}>
        <Regular style={styles.header}>
          {t('all')} {localizedCategory}
        </Regular>
      </View>

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loader width={mvs(250)} height={mvs(250)} />
          {/* <ActivityIndicator size="large" color="#000" /> */}
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
                    name: `${t('all')} ${localizedCategory}`,
                  })
                }>
                <View style={styles.titleContainer}>
                  <Regular style={styles.subCategoryText}>
                    {t('all')} {localizedCategory}
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
