import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  View,
} from 'react-native';
import MainHeader from '../../../components/Headers/MainHeader';
import {mvs} from '../../../util/metrices';
import Loader from '../../../components/Loader';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import API from '../../../api/apiServices';
import {BASE_URL_Product} from '../../../api/apiServices';
import Bold from '../../../typography/BoldText';
import {LocationSvg} from '../../../assets/svg';
import i18n from '../../../i18n/i18n';
import styles from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {ForwardSVG} from '../../../assets/svg';

export const AllCategoriesView = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const {token} = useSelector(state => state.user);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get(`viewCategories`, {
        headers: {
          Authorization: {token},
        },
      });

      if (res.data.success) {
        const categoriesWithSubs = await Promise.all(
          res.data.data.map(async category => {
            try {
              const subRes = await API.get(`getSubCategory/${category.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return {
                ...category,
                hasSubcategories: subRes.data.data.length > 0,
              };
            } catch {
              return {
                ...category,
                hasSubcategories: false,
              };
            }
          }),
        );
        setCategories(categoriesWithSubs);
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = async (categoryName, categoryId) => {
    try {
      const res = await API.get(`getSubCategory/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const subcategories = res.data.data;
        console.log('Response of categories:', subcategories);
        navigation.navigate('SubCategoryMain', {
          category: categoryName,
          categoryId: categoryId,
          subcategories,
        });
        console.log(`Category ${categoryName} clicked`);
      } else {
        console.warn('No subcategories found');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error.message);
    }
  };

  const renderCategoryItem = ({item}) => {
    const imageURL = item.image ? `${BASE_URL_Product}${item.image}` : null;
    return (
      <TouchableOpacity
        onPress={() =>
          handleCategoryPress(
            i18n.language === 'ar' ? item.ar_name : item.name,
            item.id,
          )
        }
        style={{...styles.categoryItem}}>
        <View style={styles.IconContainer}>
          {imageURL ? (
            <Image
              source={{uri: imageURL}}
              style={{
                width: '100%',
                height: '100%',
                // backgroundColor: 'blue',
                // height: mvs(80),
                // borderRadius: 30,
                resizeMode: 'contain',
              }}
            />
          ) : (
            <LocationSvg width={24} height={24} />
          )}
        </View>
        <View style={styles.rowContainer}>
          <Bold
            style={styles.categoryText}
            numberOfLines={2}
            ellipsizeMode="tail">
            {i18n.language === 'ar' ? item.ar_name : item.name}
          </Bold>
          {/* {item.hasSubcategories && (
            <View style={{marginTop: mvs(5), alignItems: 'center'}}>
              <ForwardSVG width={18} height={18} />
            </View>
          )} */}
        </View>
      </TouchableOpacity>
    );
  };

  const filteredCategories = categories.filter(
    category => category.name !== 'Other Categories' && category.status !== 2,
  );

  const desiredOrder = [
    'Vehicle',
    'Property',
    'Spare Parts',
    'Services',
    'New & Used',
  ];

  // Function to sort categories
  const sortCategories = categoriestoSort => {
    return categoriestoSort.sort((a, b) => {
      const indexA = desiredOrder.indexOf(a.name);
      const indexB = desiredOrder.indexOf(b.name);

      // If both categories are in the desired order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the desired order, prioritize it
      if (indexA !== -1) {
        return -1;
      }
      if (indexB !== -1) {
        return 1;
      }

      // If neither is in the desired order, maintain original order
      return 0;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={t('titleCategories')} showBackIcon={true} />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loader width={mvs(250)} height={mvs(250)} />
          {/* <ActivityIndicator size="large" color="#008e91" /> */}
        </View>
      ) : (
        <FlatList
          data={sortCategories([...filteredCategories])}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.categoryList}
        />
      )}
    </SafeAreaView>
  );
};

export default AllCategoriesView;
