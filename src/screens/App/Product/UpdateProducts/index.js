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
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Snackbar} from 'react-native-paper';
import MainHeader from '../../../../components/Headers/MainHeader';
import {MyButton} from '../../../../components/atoms/InputFields/MyButton';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';
import {EYESVG, UploadSVG} from '../../../../assets/svg';
import GooglePlacesSuggestion from '../../../../components/GooglePlacesSuggestion';
import {useTranslation} from 'react-i18next';
import PriceInputWithDropdown from '../../../../components/atoms/InputFields/PriceInputWithCurrency';
import API from '../../../../api/apiServices';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import {styles} from '../CreateProduct/styles';
import {showSnackbar} from '../../../../redux/slices/snackbarSlice';

const UpdateProduct = () => {
  const route = useRoute();
  const {
    productId,
    id: subCategoryId,
    categoryId,
    name,
    category,
    categoryImage,
  } = route.params;
  const {token} = useSelector(state => state.user);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    // stock: '',
    discount: '',
    specialOffer: '',
    images: [],
    location: '',
    lat: '',
    long: '',
    custom_fields: [],
    currency: '',
    contactInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [categoryImage1, setCategoryImage1] = useState('');

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  // const [selectedCondition, setSelectedCondition] = useState('');
  // const conditionValue =
  //   selectedCondition === 'New' ? 1 : selectedCondition === 'Used' ? 2 : null;

  // const handleConditionSelect = condition => {
  //   setSelectedCondition(condition);
  //   handleInputChange('condition', condition);
  // };

  useEffect(() => {
    if (route.params) {
      const {
        productName,
        description,
        price,
        // stock,
        discount,
        specialOffer,
        images,
        location,
        lat,
        long,
        custom_fields = [],
        currency,
        contactInfo,
        // condition,
      } = route.params;

      const getImageUri = img => {
        if (typeof img === 'string') {
          return img.startsWith('file://')
            ? img
            : `https://backend.souqna.net/${img}`;
        } else if (img?.uri) {
          return img.uri.startsWith('file://')
            ? img.uri
            : `https://backend.souqna.net/${img.uri}`;
        } else if (img?.path) {
          return `https://backend.souqna.net${img.path}`;
        }
        return '';
      };

      const formattedImages =
        images?.map(img => ({
          id: typeof img === 'object' && img?.id ? img.id : null,
          uri: getImageUri(img),
          fileName: getImageUri(img).split('/').pop(),
          type: 'image/jpeg',
          fileSize: 1000,
        })) || [];
      try {
        const parsedCustomFields = JSON.parse(custom_fields);
        setFormData({
          name: productName || '',
          description: description || '',
          price: price?.toString() || '',
          // stock: stock?.toString() || '',
          discount: discount?.toString() || '',
          specialOffer: specialOffer || '',
          images: formattedImages,
          location: location || '',
          lat: lat || '',
          long: long || '',
          custom_fields: parsedCustomFields, // Use the parsed array
          currency: currency || '',
          contactInfo: contactInfo || '',
        });
      } catch (error) {
        console.error('Error parsing custom_fields:', error);
        setFormData({
          name: productName || '',
          description: description || '',
          price: price?.toString() || '',
          // stock: stock?.toString() || '',
          discount: discount?.toString() || '',
          specialOffer: specialOffer || '',
          images: formattedImages,
          location: location || '',
          lat: lat || '',
          long: long || '',
          custom_fields: [], // Default to an empty array if parsing fails
          currency: currency || '',
          contactInfo: contactInfo || '',
        });
      }
    }
  }, [route.params]);

  const pickAndUploadImages = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0, // multiple images allowed
      });

      if (result.didCancel) return;

      const newImages = result.assets.map(asset => ({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      }));
      console.log('NEW IMAGES: ', newImages);
      // Now call uploadImages with the selected images
      await uploadImages(newImages);

      // Also update local form data images if needed
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (err) {
      console.error('Image picker error:', err);
      dispatch(showSnackbar(t('Failed to pick or upload images')));
      // setSnackbarMessage('Failed to pick or upload images');
      // setSnackbarVisible(true);
    }
  };

  // Upload new images API call
  const uploadImages = async newImages => {
    try {
      if (!newImages || newImages.length === 0) return;

      const formData = new FormData();
      formData.append('id', productId);

      newImages.forEach((img, idx) => {
        formData.append('images[]', {
          uri: img.uri,
          name: img.fileName || `image_${idx}.jpg`,
          type: img.type || 'image/jpeg',
        });
      });

      const response = await API.post('uploadProductImage', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        dispatch(
          showSnackbar(
            t(response.data.message || 'Images uploaded successfully'),
          ),
        );

        // setSnackbarMessage(
        //   response.data.message || 'Images uploaded successfully',
        // );
        // setSnackbarVisible(true);
        // navigation.replace('MainTabs')
      } else {
        dispatch(showSnackbar(t('Image upload failed')));

        // setSnackbarMessage('Image upload failed');
        // setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Upload image error:', error);
      dispatch(showSnackbar(t('Error uploading images')));

      // setSnackbarMessage('Error uploading images');
      // setSnackbarVisible(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleRemoveImage = async indexToRemove => {
    const imageToRemove = formData.images[indexToRemove];
    console.log('Image to remove id: ', imageToRemove?.id);
    if (imageToRemove?.id) {
      try {
        setLoading(true);

        // Call delete API
        await API.delete(`deleteImage/${imageToRemove.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // On success, remove image locally
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
        dispatch(showSnackbar(t('Image deleted successfully')));

        // setSnackbarMessage('Image deleted successfully');
        // setSnackbarVisible(true);
      } catch (error) {
        console.error(
          'Failed to delete image:',
          error.response || error.message,
        );
        dispatch(showSnackbar(t('Failed to delete image.')));

        // setSnackbarMessage('Failed to delete image.');
        // setSnackbarVisible(true);
      } finally {
        setLoading(false);
      }
    } else {
      // No id (newly added image, not yet uploaded), just remove locally
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove),
      }));
    }
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

  const submitProduct = async () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      id: route.params?.productId, // Important
      categoryID: categoryId,
      subCategoryID: subCategoryId,
      // stock: Number(formData.stock),
      location: formData.location,
      lat: formData.lat,
      long: formData.long,
      discount: formData.discount,
      // stock: formData.stock,
      // condition: conditionValue,
      // negotiable: formData.negotiable,
      // contactInfo: formData.contactInfo,
      custom_fields: formData.custom_fields,
      currency: formData.currency,
      contactInfo: formData.contactInfo,
    };

    console.log('DATA BEING SENT :', payload);

    try {
      setLoading(true);
      console.log('Calling:', 'updateProduct', payload);

      const response = await API.post('updateProduct', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Response:', response.data);

      if (response.data.success) {
        // setSnackbarMessage(t('Product Updated'));
        // setSnackbarVisible(true);
        dispatch(showSnackbar(t('The Ad has been updated successfully')));

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'MainTabs'}],
          }),
        );
      } else {
        dispatch(
          showSnackbar(t(response.data.message || 'Failed to update product.')),
        );

        // setSnackbarMessage(
        //   response.data.message || 'Failed to update product.',
        // );
      }

      // setSnackbarVisible(true);
    } catch (error) {
      if (error.response) {
        console.error('❌ Error Response:', error.response.data);
      } else if (error.request) {
        console.error('❌ No response:', error.request);
      } else {
        console.error('❌ Error Message:', error.message);
      }

      dispatch(showSnackbar(t('Network Error: Unable to update product.')));

      // setSnackbarMessage('Network Error: Unable to update product.');
      // setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = () => {
    navigation.navigate('Category', {
      onSelect: (selectedCategory, selectedSubcategory) => {
        console.log('Selected:', selectedCategory, selectedSubcategory);
        setSelectedCategory(selectedCategory);
        setSelectedSubCategory(selectedSubcategory);
        setCategoryImage1(selectedCategory.image); // Add this if needed
        if (selectedCategory) {
          setSelectedCategory(selectedCategory);
          setCategoryImage1(selectedCategory.image);
        }
        if (selectedSubCategory) {
          setSelectedSubCategory(selectedSubCategory);
        }
      },
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={'Update Product'} showBackIcon={true} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Adjust if you have headers
      >
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
                  source={{uri: selectedCategory?.image || categoryImage}}
                  style={styles.categoryImage}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                  }}>
                  <View style={styles.fixedTextBox}>
                    <Text
                      style={styles.categoryTitle}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {selectedCategory?.name || category}
                    </Text>
                    <Text
                      style={styles.categorySubtitle}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {selectedSubCategory?.name || name}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={handleChange}>
                    <Text style={styles.changeText}>{t('change')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.uploadBox}>
              {formData.images.length === 0 ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={pickAndUploadImages}>
                  <Text style={styles.addButtonText}>{t('addImages')}</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  {formData.images.length > 0 && (
                    <View style={styles.imagePreviewContainer}>
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[{isUploadIcon: true}, ...formData.images]}
                        keyExtractor={(item, index) =>
                          item.id ? item.id.toString() : `upload-icon-${index}`
                        }
                        contentInset={{right: 25}}
                        contentContainerStyle={styles.flatListContainer}
                        // style
                        renderItem={({item, index}) =>
                          item.isUploadIcon ? (
                            <TouchableOpacity
                              onPress={pickAndUploadImages}
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
                              {/* Eye Icon Overlay */}
                              <TouchableOpacity
                                onPress={() => {
                                  // 👁 Navigate to a preview screen or show modal
                                  navigation.navigate('ImagePreview', {
                                    uri: item.uri,
                                  });
                                }}
                                style={{
                                  position: 'absolute',
                                  bottom: 5,
                                  right: 5,
                                  backgroundColor: 'rgba(0,0,0,0.6)',
                                  padding: 4,
                                  borderRadius: 20,
                                }}>
                                <EYESVG size={20} color="#adbd6e" />
                              </TouchableOpacity>
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
          {/* <View style={styles.sectionContainer}>
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
          </View> */}

          {/* Name Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('Ad Name')}
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
            <PriceInputWithDropdown
              value={formData.price}
              onChangeText={text => handleInputChange('price', text)}
              selectedCurrency={formData.currency}
              onCurrencyChange={currency =>
                handleInputChange('currency', currency)
              }
              placeholder={t('pricePlaceholder')}
            />

            {/* <TextInput
              style={styles.input}
              placeholder={t('pricePlaceholder')}
              placeholderTextColor={colors.grey}
              keyboardType="numeric"
              value={formData.price}
              onChangeText={text => handleInputChange('price', text)}
            /> */}
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

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('Contact Info')}
              {/* <Text style={{color: colors.red}}>*</Text> */}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('Enter Contact')}
              placeholderTextColor={colors.grey}
              value={formData.contactInfo}
              onChangeText={text => handleInputChange('contactInfo', text)}
            />
          </View>

          {/* Stock Section */}
          {/* <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('availableStock')}
              <Text style={{color: colors.red}}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('stockPlaceholder')}
              placeholderTextColor={colors.grey}
              keyboardType="numeric"
              value={formData.stock}
              onChangeText={text => handleInputChange('stock', text)}
            />
          </View> */}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('Custom Fields')}</Text>
            {Array.isArray(formData.custom_fields) ? (
              formData.custom_fields.map((field, index) => (
                <View key={index} style={styles.fieldContainer}>
                  <Text style={styles.sectionTitle}>{field.name}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t('enterValue')}
                    placeholderTextColor={colors.grey}
                    value={field.value || ''}
                    onChangeText={text => {
                      const updatedFields = formData.custom_fields.map(
                        (f, idx) => (idx === index ? {...f, value: text} : f),
                      );
                      handleInputChange('custom_fields', updatedFields);
                    }}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.errorText}>
                Custom fields are not available
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <MyButton
            title={loading ? t('submitting') : t('Update Product')}
            style={styles.submitButton}
            onPress={submitProduct}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.green} />
            ) : (
              <Text style={styles.submitButtonText}>{t('Update Product')}</Text>
            )}
          </MyButton>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

export default UpdateProduct;
