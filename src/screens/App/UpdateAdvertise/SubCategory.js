import {View, FlatList, TouchableOpacity, StatusBar, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ForwardSVG} from '../../../assets/svg';
import styles from '../AdvertiseAll/style';
import {useTranslation} from 'react-i18next';
import {BASE_URL_Product} from '../../../api/apiServices';
import i18n from '../../../i18n/i18n';
import {mvs} from '../../../util/metrices';

const SubCategory = () => {
  const route = useRoute();
  const {category, categoryId, categoryImage, subcategories, onSelect} =
    route.params;
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handleSubcategoryPress = subcategory => {
    console.log(`Advertise ${subcategory.name} clicked`);
    if (onSelect) {
      onSelect(
        {id: categoryId, name: category, image: categoryImage}, // selectedCategory
        subcategory, // selectedSubCategory
      );
    }
    navigation.pop(2);
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
        <View style={styles.subCategoryLeft}>
          <Regular style={styles.subCategoryText}>
            {i18n.language === 'ar' ? item.ar_name : item.name}
          </Regular>
        </View>
        <ForwardSVG width={22} height={22} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CategoryHeader title={category} onBack={handleBack} />
      <View style={styles.headerContainer}>
        <Regular style={styles.header}>
          {t('In All')} {category}
        </Regular>
      </View>
      <View style={styles.content}>
        <FlatList
          data={subcategories}
          keyExtractor={item => item.id.toString()}
          renderItem={renderSubCategoryItem}
          contentContainerStyle={styles.content}
        />
      </View>
    </SafeAreaView>
  );
};

export default SubCategory;
