import {useState, useEffect} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import dummyData from '../../../../util/dummyData';
import {HOMESVG, BurgerMenu} from '../../../../assets/svg';
import CategorySkeleton from './CategorySkeleton';
import {useDispatch, useSelector} from 'react-redux';
import API, {
  BASE_URL_Product,
  fetchCategories,
} from '../../../../api/apiServices';
import {setCategories} from '../../../../redux/slices/categorySlice';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../CustomText';
import {mvs} from '../../../../util/metrices';

const {categoryIcons} = dummyData;

const CategorySection = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const categories = useSelector(state => state.category.categories);
  const {token} = useSelector(state => state.user);
  const {t, i18n} = useTranslation();

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Define the desired order with layout specification
  const categoryLayout = {
    firstRow: ['Vehicle', 'Property'], // Big cards
    secondRow: ['Services', 'New & Used', 'Spare Parts'], // Small cards
  };

  // Function to organize categories by layout
  const organizeCategoriesByLayout = categoriesData => {
    const organized = {
      firstRow: [],
      secondRow: [],
    };

    // Filter active categories
    const activeCategories = categoriesData.filter(item => item.status === 1);

    // Organize first row (big cards)
    categoryLayout.firstRow.forEach(categoryName => {
      const category = activeCategories.find(cat => cat.name === categoryName);
      if (category) {
        organized.firstRow.push(category);
      }
    });

    // Organize second row (small cards)
    categoryLayout.secondRow.forEach(categoryName => {
      const category = activeCategories.find(cat => cat.name === categoryName);
      if (category) {
        organized.secondRow.push(category);
      }
    });

    return organized;
  };

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      const res = await fetchCategories(token);
      if (res?.success) {
        console.log('Setting Categories:', res.data);
        dispatch(setCategories(res.data));
      } else {
        console.warn('Failed to fetch categories');
      }
      setIsLoading(false);
    };

    if (!categories || categories.length === 0) {
      loadCategories();
    } else {
      setIsLoading(false);
    }
  }, [token]);

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

  const renderCategoryItem = (item, isBig = false) => {
    const imageURL = item.image ? `${BASE_URL_Product}${item.image}` : null;
    const Icon = categoryIcons[item.name] || HOMESVG;
    const cardStyle = isBig ? styles.bigCard : styles.smallCard;
    const iconStyle = isBig ? styles.bigIcon : styles.smallIcon;

    return (
      <TouchableOpacity
        key={item.id.toString()}
        style={{...cardStyle}} // Now includes improved shadows
        // style={{...cardStyle, ...styles.cardShadowDeep}} // Now includes improved shadows
        onPress={() =>
          handleCategoryPress(
            i18n.language === 'ar' ? item.ar_name : item.name,
            item.id,
          )
        }>
        {imageURL ? (
          <Image
            resizeMode="contain"
            source={{uri: imageURL}}
            style={iconStyle}
          />
        ) : (
          <View
            style={[
              iconStyle,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Icon width={isBig ? 70 : 45} height={isBig ? 70 : 45} />
          </View>
        )}
        <CustomText
          style={{...styles.categoryText, fontSize: isBig ? mvs(25) : mvs(13)}}
          numberOfLines={2}
          ellipsizeMode="tail">
          {i18n.language === 'ar' ? item.ar_name : item.name}
        </CustomText>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <CategorySkeleton />;
  }

  const organizedCategories = organizeCategoriesByLayout(categories);

  return (
    <View style={styles.categoryContainer}>
      {/* First Row - Big Cards */}
      <View style={styles.row}>
        {organizedCategories.firstRow.map(item =>
          renderCategoryItem(item, true),
        )}
      </View>

      {/* Second Row - Small Cards */}
      <View style={styles.row1}>
        {organizedCategories.secondRow.map(item =>
          renderCategoryItem(item, false),
        )}
        <TouchableOpacity
          style={[
            styles.smallCard,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          onPress={() => navigation.navigate('AllCategoriesView')}>
          <View
            style={[
              styles.smallIcon,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <BurgerMenu width={45} height={45} />
          </View>
          <CustomText
            style={styles.categoryText}
            numberOfLines={2}
            ellipsizeMode="tail">
            {t('All Categories')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CategorySection;
