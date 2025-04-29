import React from 'react';
import {View, FlatList, TouchableOpacity, StatusBar, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './style';
import CategoryHeader from '../../../components/Headers/CategoryHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ForwardSVG} from '../../../assets/svg';
import {mvs} from '../../../util/metrices';

const AdvertiseAll = () => {
  const route = useRoute();
  const {category, subcategories, categoryId} = route.params;
  const navigation = useNavigation();

  const handleSubcategoryPress = subcategory => {
    console.log(`Advertise ${subcategory.name} clicked`);
    navigation.navigate('CreateProduct', {
      categoryId: categoryId,
      category,
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: mvs(10),
        }}>
        <Image
          source={require('../../../assets/img/phone.png')}
          style={{width: 45, height: 45, borderRadius: 5}}
        />
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
        <Regular style={styles.header}>{category}</Regular>
      </View>
      <View style={styles.content}>
        <FlatList
          data={subcategories}
          keyExtractor={item => item.id}
          renderItem={renderSubCategoryItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default AdvertiseAll;
