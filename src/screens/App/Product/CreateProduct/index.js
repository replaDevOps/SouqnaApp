/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {Snackbar} from 'react-native-paper';
import {styles} from './styles';
import MainHeader from '../../../../components/Headers/MainHeader';
import {MyButton} from '../../../../components/atoms/InputFields/MyButton';
import {colors} from '../../../../util/color';
import {SafeAreaView} from 'react-native-safe-area-context';
import {mvs} from '../../../../util/metrices';
import {UploadSVG} from '../../../../assets/svg';
import GooglePlacesSuggestion from '../../../../components/GooglePlacesSuggestion';
import {useTranslation} from 'react-i18next';

const CreateProduct = () => {
  const route = useRoute();
  const {
    id: subCategoryId,
    categoryId,
    name,
    category,
    categoryImage,
  } = route.params;
  const {token} = useSelector(state => state.user);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    discount: '',
    specialOffer: '',
    images: [],
    location: '',
    lat: '',
    long: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const conditionValue =
    selectedCondition === 'New' ? 1 : selectedCondition === 'Used' ? 2 : null;
  const [stockError, setStockError] = useState('');

  const handleConditionSelect = condition => {
    setSelectedCondition(condition);
    handleInputChange('condition', condition);
  };

  const handleChooseImages = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImages = response.assets || [];
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...selectedImages],
        }));
      }
    });
  };

  //sghhss

  const handleInputChange = (field, value) => {
    // if (field === 'stock') {
    //   const numericValue = Number(value);
    //   if (numericValue <= 0 || isNaN(numericValue)) {
    //     return; // Don't update if zero, negative or not a number
    //   }
    // }
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleRemoveImage = indexToRemove => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle place selection from Google Places component
  const handlePlaceSelected = placeData => {
    setFormData(prev => ({
      ...prev,
      location: placeData.location,
      lat: placeData.lat,
      long: placeData.long,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSnackbarMessage('Product name is required.');
      setSnackbarVisible(true);
      return false;
    }

    if (!formData.description.trim()) {
      setSnackbarMessage('Description is required.');
      setSnackbarVisible(true);
      return false;
    }

    const price = Number(formData.price);
    if (isNaN(price) || price <= 0) {
      setSnackbarMessage('Price must be greater than 0.');
      setSnackbarVisible(true);
      return false;
    }

    const stock = Number(formData.stock);
    if (isNaN(stock) || stock <= 0) {
      setSnackbarMessage('Stock must be greater than 0.');
      setSnackbarVisible(true);
      return false;
    }

    if (!selectedCondition) {
      setSnackbarMessage('Please select a product condition.');
      setSnackbarVisible(true);
      return false;
    }

    return true;
  };

  const submitProduct = async () => {
    if (!validateForm()) {
      return;
    }
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('categoryID', categoryId);
    data.append('subCategoryID', subCategoryId);

    formData.images.forEach((image, index) => {
      if (image.fileSize > 2 * 1024 * 1024) {
        setSnackbarMessage('Each image must be under 2MB.');
        setSnackbarVisible(true);
        return;
      }

      data.append('images[]', {
        uri: image.uri,
        name: image.fileName || `photo_${index}.jpg`,
        type: image.type || 'image/jpeg',
      });
    });

    data.append('stock', formData.stock);
    data.append('discount', formData.discount);
    data.append('specialOffer', formData.specialOffer);
    data.append('location', formData.location);
    data.append('lat', formData.lat);
    data.append('long', formData.long);
    data.append('condition', conditionValue);

    try {
      setLoading(true);
      const response = await axios.post(
        'https://backend.souqna.net/api/createProduct',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('✅ Response:', response.data);

      if (response.data.success) {
        setSnackbarMessage(t('productCreatedSuccess'));
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          discount: '',
          specialOffer: '',
          images: [],
          location: '',
          lat: '',
          long: '',
          condition: '',
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'MainTabs',
              },
            ],
          }),
        );
      } else {
        setSnackbarMessage(
          response.data.message || 'Failed to create product.',
        );
      }

      setSnackbarVisible(true);
    } catch (error) {
      console.error(
        '❌ Error creating product:',
        error.response?.data || error.message,
      );
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        t('somethingWentWrong');

      // Check if 403 error (profile not verified)
      if (error.response?.status === 403) {
        errorMessage = t('profileNotVerified');
      }
      // Check if it's an image size error
      else if (
        typeof errorMessage === 'string' &&
        errorMessage.includes('images.')
      ) {
        errorMessage = errorMessage.replace(/images\.(\d+)/g, (match, p1) => {
          const imageIndex = parseInt(p1, 10) + 1;
          return `Image ${imageIndex}`;
        });

        errorMessage = errorMessage.replace(
          'greater than 2048 kilobytes',
          'must be less than 2MB',
        );
      }
      setSnackbarMessage(error.message || 'Something went wrong. Try again!');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            // pass params to switch to Advertise tab
            params: {
              screen: 'Advertise',
            },
          },
        ],
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={t('titleProduct')} showBackIcon={true} />

      <ScrollView
        style={{
          paddingHorizontal: mvs(15),
          paddingTop: mvs(25),
          backgroundColor: colors.white,
        }}
        contentContainerStyle={{paddingBottom: mvs(60)}}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('category')}</Text>
          <View style={styles.categoryBox}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: categoryImage}}
                style={styles.categoryImage}
              />
              <View style={{marginLeft: mvs(10)}}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categorySubtitle}>{name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleChange}>
              <Text style={styles.changeText}>{t('change')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadBox}>
            {formData.images.length === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleChooseImages}>
                <Text style={styles.addButtonText}>{t('addImages')}</Text>
              </TouchableOpacity>
            ) : (
              // After image is added
              <View>
                {/* <TouchableOpacity onPress={handleChooseImages} style={styles.iconRow}>
                <UploadSVG width={22} height={22} style={styles.uploadIcon} />
                <Text>Upload Image</Text>
              </TouchableOpacity> */}

                {formData.images.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={[{isUploadIcon: true}, ...formData.images]}
                      keyExtractor={(item, index) => index.toString()}
                      contentInset={{right: 25}}
                      contentContainerStyle={styles.flatListContainer}
                      // style
                      renderItem={({item, index}) =>
                        item.isUploadIcon ? (
                          <TouchableOpacity
                            onPress={handleChooseImages}
                            style={styles.iconRow}>
                            <UploadSVG
                              width={22}
                              height={22}
                              style={styles.uploadIcon}
                            />
                            <Text style={styles.uploadText}>
                              {t('uploadImage')}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.imageWrapper}>
                            <Image
                              source={{uri: item.uri}}
                              style={styles.imagePreview}
                            />
                            <TouchableOpacity
                              style={styles.removeIcon}
                              onPress={() => handleRemoveImage(index - 1)} // subtract 1 due to upload icon
                            >
                              <Text style={styles.removeIconText}>✕</Text>
                            </TouchableOpacity>
                          </View>
                        )
                      }
                    />
                  </View>
                )}
              </View>
            )}
            <View>{/* Display Selected Images */}</View>

            <Text style={styles.noteText}>{t('coverNote')} </Text>
          </View>
        </View>

        {/* Condition Section - Updated to Radio Buttons */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('condition')}
            <Text style={{color: colors.red}}>*</Text>
          </Text>

          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleConditionSelect('New')}>
              <View style={styles.radioWrapper}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedCondition === 'New' && styles.radioOuterSelected,
                  ]}>
                  {selectedCondition === 'New' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              <Text style={styles.radioText}>{t('new')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleConditionSelect('Used')}>
              <View style={styles.radioWrapper}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedCondition === 'Used' && styles.radioOuterSelected,
                  ]}>
                  {selectedCondition === 'Used' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              <Text style={styles.radioText}>{t('used')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('name')}
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('namePlaceholder')}
            placeholderTextColor={colors.grey}
            value={formData.name}
            onChangeText={text => handleInputChange('name', text)}
          />
        </View>

        {/* Description Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('description')}
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, {height: mvs(100)}]}
            placeholder={t('descriptionPlaceholder')}
            placeholderTextColor={colors.grey}
            value={formData.description}
            multiline
            onChangeText={text => handleInputChange('description', text)}
          />
        </View>

        {/* Location Section - Fixed */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('location')}
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <View style={styles.locationContainer}>
            <GooglePlacesSuggestion
              initialValue={formData.location}
              onPlaceSelected={handlePlaceSelected}
            />
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('price')}
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('pricePlaceholder')}
            placeholderTextColor={colors.grey}
            keyboardType="numeric"
            value={formData.price}
            onChangeText={text => handleInputChange('price', text)}
          />
        </View>

        {/* Discount Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('discount')}
            {/* <Text style={{color: colors.red}}>*</Text> */}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('discountPlaceholder')}
            keyboardType="numeric"
            placeholderTextColor={colors.grey}
            value={formData.discount}
            onChangeText={text => handleInputChange('discount', text)}
          />
        </View>

        {/* Special Offer Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('specialOffer')}
            {/* <Text style={{color: colors.red}}>*</Text> */}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('specialOfferPlaceholder')}
            placeholderTextColor={colors.grey}
            value={formData.specialOffer}
            onChangeText={text => handleInputChange('specialOffer', text)}
          />
        </View>

        {/* Stock Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('availableStock')}
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              stockError ? {borderColor: colors.red, borderWidth: 1} : null,
            ]}
            placeholder={t('stockPlaceholder')}
            placeholderTextColor={colors.grey}
            keyboardType="numeric"
            value={formData.stock}
            onChangeText={text => {
              // Remove non-digit characters
              const cleaned = text.replace(/[^0-9]/g, '');

              // Set error if 0
              if (cleaned === '0') {
                setStockError(t('Stock cannot be zero'));
              } else {
                setStockError('');
              }

              handleInputChange('stock', cleaned);
            }}
          />
          {stockError ? (
            <Text style={{color: colors.red, marginTop: 5}}>{stockError}</Text>
          ) : null}
        </View>

        {/* Submit Button */}
        <MyButton
          title={loading ? t('submitting') : t('submitProduct')}
          style={styles.submitButton}
          onPress={submitProduct}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.green} />
          ) : (
            <Text style={styles.submitButtonText}>{t('submit')}</Text>
          )}
        </MyButton>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

export default CreateProduct;
