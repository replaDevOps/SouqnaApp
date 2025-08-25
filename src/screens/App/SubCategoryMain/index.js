import {useState} from 'react';
import {View, FlatList, TouchableOpacity, StatusBar, Image} from 'react-native';
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
import {useSelector} from 'react-redux';
import {colors} from '../../../util/color';

const SubCategoryMain = () => {
  const route = useRoute();
  const {category, subcategories, categoryId} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pressedItem, setPressedItem] = useState(null);
  const {token} = useSelector(state => state.user);

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

        const isLoggedIn = Boolean(token);

        const response = await fetchBuyerProducts(filters, isLoggedIn);

        if (response?.data?.length > 0) {
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
    const isPressed = pressedItem === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.subCategoryItem,
          isPressed && styles.subCategoryItemPressed,
        ]}
        onPressIn={() => setPressedItem(item.id)}
        onPressOut={() => setPressedItem(null)}
        onPress={() => handleSubcategoryPress(item)}
        activeOpacity={0.95}>
        <View style={styles.IconContainer}>
          {imageURL && (
            <Image
              source={{uri: imageURL}}
              style={{
                width: mvs(60),
                height: mvs(60),
                resizeMode: 'contain',
              }}
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

  const renderAllCategoryHeader = () => {
    const isPressed = pressedItem === 'all';

    return (
      <TouchableOpacity
        style={[
          styles.subCategoryItemHighlight, // Use highlight style for "All" item
          isPressed && styles.subCategoryItemPressed,
        ]}
        onPressIn={() => setPressedItem('all')}
        onPressOut={() => setPressedItem(null)}
        onPress={() =>
          handleSubcategoryPress({
            id: null,
            name: `${t('all')} ${localizedCategory}`,
          })
        }
        activeOpacity={0.95}>
        <View style={styles.titleContainer}>
          <Regular style={[styles.subCategoryText, {fontWeight: '600'}]}>
            {t('all')} {localizedCategory}
          </Regular>
        </View>
        <ForwardSVG width={26} height={26} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.white}]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <CategoryHeader title={localizedCategory} onBack={handleBack} />
      <View style={styles.headerContainer}>
        <Regular style={styles.header}>
          {t('all')} {localizedCategory}
        </Regular>
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white,
          }}>
          <Loader width={mvs(250)} height={mvs(250)} />
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={subcategories}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={renderSubCategoryItem}
            contentContainerStyle={{paddingBottom: mvs(80)}}
            ListHeaderComponent={renderAllCategoryHeader}
            style={{backgroundColor: colors.white}} // Ensure FlatList background is white
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SubCategoryMain;
