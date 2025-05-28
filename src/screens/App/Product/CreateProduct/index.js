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
import axios from 'axios';
import {useSelector} from 'react-redux';
import {Snackbar} from 'react-native-paper';
import {styles} from './styles';
import MainHeader from '../../../../components/Headers/MainHeader';
import {MyButton} from '../../../../components/atoms/InputFields/MyButton';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';
import {UploadSVG} from '../../../../assets/svg';
import GooglePlacesSuggestion from '../../../../components/GooglePlacesSuggestion';
import {useTranslation} from 'react-i18next';
import PriceInputWithDropdown from '../../../../components/atoms/InputFields/PriceInputWithCurrency';
import API from '../../../../api/apiServices';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import PhotoManipulator from 'react-native-photo-manipulator';
import ImageResizer from 'react-native-image-resizer';

const CreateProduct = () => {
  const route = useRoute();
  const {
    id: subCategoryId,
    categoryId,
    name,
    category,
    categoryImage,
  } = route.params;
  const categoryType = category.toLowerCase();
  const {token} = useSelector(state => state.user);
  const navigation = useNavigation();
  const {t} = useTranslation();

  let initialFormData = {
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
  };

  if (categoryType === 'vehicle') {
    initialFormData = {
      ...initialFormData,
      title: '',
      category: '',
      make: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      power: '',
      doors: '',
      vehicleType: '',
      condition: '',
      registrationDate: '',
      inspectionValidUntil: '',
      vin: '',
      previousOwners: '',
      serviceHistory: '',
      registrationCity: '',
      insuranceValidUntil: '',
      tyreCondition: '',
      spareKey: '',
      equipment: '',
      price: '',
      negotiable: '',
    };
  } else if (categoryType === 'property') {
    initialFormData = {
      ...initialFormData,
      adTitle: '',
      purpose: '',
      propertyType: '',
      city: '',
      neighborhood: '',
      mapLocation: '',
      size: '',
      price: '',
      negotiable: '',
      rooms: '',
      bathrooms: '',
      floorNumber: '',
      totalFloors: '',
      furnished: '',
      balcony: '',
      parking: '',
      elevator: '',
      waterElectricity: '',
      heatingCooling: '',
      titleDeed: '',
      yearBuilt: '',
      facingDirection: '',
      view: '',
      petsAllowed: '',
      nearbyLandmarks: '',
      monthlyMaintenanceCost: '',
      floorPlan: '',
      distanceFromCityCenter: '',
      media: [],
      description: '',
    };
  } else if (categoryType === 'jobs') {
    initialFormData = {
      ...initialFormData,
      jobTitle: '',
      industry: '',
      employmentType: '',
      description: '',
      requirements: '',
      companyName: '',
      jobLocation: '',
      experienceRequired: '',
      educationRequired: '',
      skills: '',
      genderPreference: '',
      workTiming: '',
      vacancies: '',
      contractDuration: '',
      applicationDeadline: '',
      contactMethod: '',
      salary: '',
      salaryType: '',
      benefits: '',
    };
  }

  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const conditionValue =
    selectedCondition === 'New' ? 1 : selectedCondition === 'Used' ? 2 : null;

  const handleConditionSelect = condition => {
    setSelectedCondition(condition);
    handleInputChange('condition', condition);
  };

  const handleInputChange = (field, value) => {
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

  const handlePlaceSelected = placeData => {
    setFormData(prev => ({
      ...prev,
      location: placeData.location,
      lat: placeData.lat,
      long: placeData.long,
    }));
  };

  const handleChooseImages = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0, // allow multiple images
      });

      if (result.didCancel) return;

      const assets = result.assets || [];

      const targetWidth = 1024;
      const targetHeight = 900;

      const processedImages = await Promise.all(
        assets.map(async asset => {
          let sourceUri = asset.uri.startsWith('file://')
            ? asset.uri
            : `file://${asset.uri}`;

          // Resize the image to ensure it meets minimum dimensions
          const resized = await ImageResizer.createResizedImage(
            sourceUri,
            targetWidth,
            targetHeight,
            'JPEG',
            80,
            0,
            undefined,
            false,
            {mode: 'contain'}, // Optional: avoid upscaling too much
          );

          sourceUri = resized.uri.startsWith('file://')
            ? resized.uri
            : `file://${resized.uri}`;

          const {width: actualWidth, height: actualHeight} = await getImageSize(
            sourceUri,
          );

          // Calculate crop region for center-cropping
          const cropRegion = {
            x: Math.max(0, (actualWidth - targetWidth) / 2),
            y: Math.max(0, (actualHeight - targetHeight) / 2),
            width: targetWidth,
            height: targetHeight,
          };

          // Crop the image
          const croppedPath = await PhotoManipulator.crop(
            sourceUri,
            cropRegion,
          );

          return {
            uri: croppedPath.startsWith('file://')
              ? croppedPath
              : `file://${croppedPath}`,
            fileName: asset.fileName || croppedPath.split('/').pop(),
            type: asset.type || 'image/jpeg',
            fileSize: asset.fileSize || 0,
          };
        }),
      );

      // Update your form data with cropped images
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...processedImages],
      }));
    } catch (error) {
      console.error('Image selection error:', error);
      setSnackbarMessage('Failed to pick or process image.');
      setSnackbarVisible(true);
    }
  };

  const submitProduct = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('categoryID', categoryId);
    data.append('subCategoryID', subCategoryId);

    for (let i = 0; i < formData.images.length; i++) {
      const image = formData.images[i];
      if (image.fileSize > 2 * 1024 * 1024) {
        setSnackbarMessage(`Image ${i + 1} must be under 2MB.`);
        setSnackbarVisible(true);
        setLoading(false);
        return;
      }

      data.append('images[]', {
        uri: image.uri,
        name: image.fileName || `photo_${i}.jpg`,
        type: image.type || 'image/jpeg',
      });
    }

    data.append('stock', formData.stock);
    data.append('discount', formData.discount);
    data.append('specialOffer', formData.specialOffer);
    data.append('location', formData.location);
    data.append('lat', formData.lat);
    data.append('long', formData.long);
    data.append('condition', conditionValue);

    if (categoryType === 'vehicle') {
      data.append('make', formData.make);
      data.append('model', formData.model);
      data.append('year', formData.year);
      data.append('mileage', formData.mileage);
      data.append('fuelType', formData.fuelType);
      data.append('transmission', formData.transmission);
      data.append('power', formData.power);
      data.append('doors', formData.doors);
      data.append('vehicleType', formData.vehicleType);
      data.append('condition', formData.condition);
      data.append('registrationDate', formData.registrationDate);
      data.append('inspectionValidUntil', formData.inspectionValidUntil);
      data.append('vin', formData.vin);
      data.append('previousOwners', formData.previousOwners);
      data.append('serviceHistory', formData.serviceHistory);
      data.append('registrationCity', formData.registrationCity);
      data.append('insuranceValidUntil', formData.insuranceValidUntil);
      data.append('tyreCondition', formData.tyreCondition);
      data.append('spareKey', formData.spareKey);
      data.append('equipment', formData.equipment);
      data.append('price', formData.price);
      data.append('negotiable', formData.negotiable);
    } else if (categoryType === 'property') {
      data.append('adTitle', formData.adTitle);
      data.append('purpose', formData.purpose);
      data.append('propertyType', formData.propertyType);
      data.append('city', formData.city);
      data.append('neighborhood', formData.neighborhood);
      data.append('mapLocation', formData.mapLocation);
      data.append('size', formData.size);
      data.append('price', formData.price);
      data.append('negotiable', formData.negotiable);
      data.append('rooms', formData.rooms);
      data.append('bathrooms', formData.bathrooms);
      data.append('floorNumber', formData.floorNumber);
      data.append('totalFloors', formData.totalFloors);
      data.append('furnished', formData.furnished);
      data.append('balcony', formData.balcony);
      data.append('parking', formData.parking);
      data.append('elevator', formData.elevator);
      data.append('waterElectricity', formData.waterElectricity);
      data.append('heatingCooling', formData.heatingCooling);
      data.append('titleDeed', formData.titleDeed);
      data.append('yearBuilt', formData.yearBuilt);
      data.append('facingDirection', formData.facingDirection);
      data.append('view', formData.view);
      data.append('petsAllowed', formData.petsAllowed);
      data.append('nearbyLandmarks', formData.nearbyLandmarks);
      data.append('monthlyMaintenanceCost', formData.monthlyMaintenanceCost);
      data.append('floorPlan', formData.floorPlan);
      data.append('distanceFromCityCenter', formData.distanceFromCityCenter);
      data.append('media', formData.media);
      data.append('description', formData.description);
    } else if (categoryType === 'jobs') {
      data.append('jobTitle', formData.jobTitle);
      data.append('industry', formData.industry);
      data.append('employmentType', formData.employmentType);
      data.append('description', formData.description);
      data.append('requirements', formData.requirements);
      data.append('companyName', formData.companyName);
      data.append('jobLocation', formData.jobLocation);
      data.append('experienceRequired', formData.experienceRequired);
      data.append('educationRequired', formData.educationRequired);
      data.append('skills', formData.skills);
      data.append('genderPreference', formData.genderPreference);
      data.append('workTiming', formData.workTiming);
      data.append('vacancies', formData.vacancies);
      data.append('contractDuration', formData.contractDuration);
      data.append('applicationDeadline', formData.applicationDeadline);
      data.append('contactMethod', formData.contactMethod);
      data.append('salary', formData.salary);
      data.append('salaryType', formData.salaryType);
      data.append('benefits', formData.benefits);
    }

    try {
      setLoading(true);
      const response = await API.post('createProduct', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

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

      if (error.response?.status === 403) {
        errorMessage = t('profileNotVerified');
      } else if (
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
      <MainHeader title={t('Post Your Ad')} showBackIcon={true} />
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
                  source={{uri: categoryImage}}
                  style={styles.categoryImage}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={styles.fixedTextBox}>
                    <Text
                      style={styles.categoryTitle}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {category}
                    </Text>
                    <Text
                      style={styles.categorySubtitle}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {name}
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
                  onPress={handleChooseImages}>
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
                        keyExtractor={(item, index) => index.toString()}
                        contentInset={{right: 25}}
                        contentContainerStyle={styles.flatListContainer}
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
                                onPress={() => handleRemoveImage(index - 1)}>
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
              <View></View>

              <Text style={styles.noteText}>{t('coverNote')}</Text>
            </View>
          </View>

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
                style={styles.radioCondition}
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
            <PriceInputWithDropdown
              value={formData.price}
              onChangeText={text => handleInputChange('price', text)}
              selectedCurrency={formData.currency}
              onCurrencyChange={currency =>
                handleInputChange('currency', currency)
              }
              placeholder={t('pricePlaceholder')}
            />
          </View>

          {/* Discount Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('discount')}</Text>
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
            <Text style={styles.sectionTitle}>{t('specialOffer')}</Text>
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
              style={styles.input}
              placeholder={t('stockPlaceholder')}
              placeholderTextColor={colors.grey}
              keyboardType="numeric"
              value={formData.stock}
              onChangeText={text => handleInputChange('stock', text)}
            />
          </View>

          {/* Category-Specific Fields */}
          {categoryType === 'vehicle' && (
            <>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Vehicle Title</Text>
                <TextInput
                  value={formData.title}
                  onChangeText={text => handleInputChange('title', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Category</Text>
                <TextInput
                  value={formData.category}
                  onChangeText={text => handleInputChange('category', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Make</Text>
                <TextInput
                  value={formData.make}
                  onChangeText={text => handleInputChange('make', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Model</Text>
                <TextInput
                  value={formData.model}
                  onChangeText={text => handleInputChange('model', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Year of Manufacture</Text>
                <TextInput
                  value={formData.year}
                  onChangeText={text => handleInputChange('year', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Mileage (km)</Text>
                <TextInput
                  value={formData.mileage}
                  onChangeText={text => handleInputChange('mileage', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Fuel Type</Text>
                <TextInput
                  value={formData.fuelType}
                  onChangeText={text => handleInputChange('fuelType', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Transmission</Text>
                <TextInput
                  value={formData.transmission}
                  onChangeText={text => handleInputChange('transmission', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Power (HP or kW)</Text>
                <TextInput
                  value={formData.power}
                  onChangeText={text => handleInputChange('power', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Number of Doors</Text>
                <TextInput
                  value={formData.doors}
                  onChangeText={text => handleInputChange('doors', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Vehicle Type</Text>
                <TextInput
                  value={formData.vehicleType}
                  onChangeText={text => handleInputChange('vehicleType', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Condition</Text>
                <TextInput
                  value={formData.condition}
                  onChangeText={text => handleInputChange('condition', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>First Registration Date</Text>
                <TextInput
                  value={formData.registrationDate}
                  onChangeText={text =>
                    handleInputChange('registrationDate', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Inspection Valid Until</Text>
                <TextInput
                  value={formData.inspectionValidUntil}
                  onChangeText={text =>
                    handleInputChange('inspectionValidUntil', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>VIN / Chassis Number</Text>
                <TextInput
                  value={formData.vin}
                  onChangeText={text => handleInputChange('vin', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Previous Owners Count</Text>
                <TextInput
                  value={formData.previousOwners}
                  onChangeText={text =>
                    handleInputChange('previousOwners', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Service History</Text>
                <TextInput
                  value={formData.serviceHistory}
                  onChangeText={text =>
                    handleInputChange('serviceHistory', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Registration City</Text>
                <TextInput
                  value={formData.registrationCity}
                  onChangeText={text =>
                    handleInputChange('registrationCity', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Insurance Valid Until</Text>
                <TextInput
                  value={formData.insuranceValidUntil}
                  onChangeText={text =>
                    handleInputChange('insuranceValidUntil', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Tyre Condition</Text>
                <TextInput
                  value={formData.tyreCondition}
                  onChangeText={text =>
                    handleInputChange('tyreCondition', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Spare Key</Text>
                <TextInput
                  value={formData.spareKey}
                  onChangeText={text => handleInputChange('spareKey', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Equipment / Features</Text>
                <TextInput
                  value={formData.equipment}
                  onChangeText={text => handleInputChange('equipment', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Price (PKR/USD)</Text>
                <TextInput
                  value={formData.price}
                  onChangeText={text => handleInputChange('price', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Negotiable</Text>
                <TextInput
                  value={formData.negotiable}
                  onChangeText={text => handleInputChange('negotiable', text)}
                  style={styles.input}
                />
              </View>
            </>
          )}

          {categoryType === 'property' && (
            <>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Ad Title</Text>
                <TextInput
                  value={formData.adTitle}
                  onChangeText={text => handleInputChange('adTitle', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Purpose</Text>
                <TextInput
                  value={formData.purpose}
                  onChangeText={text => handleInputChange('purpose', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Property Type</Text>
                <TextInput
                  value={formData.propertyType}
                  onChangeText={text => handleInputChange('propertyType', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>City / Region</Text>
                <TextInput
                  value={formData.city}
                  onChangeText={text => handleInputChange('city', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Neighborhood / Area</Text>
                <TextInput
                  value={formData.neighborhood}
                  onChangeText={text => handleInputChange('neighborhood', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Map Location</Text>
                <TextInput
                  value={formData.mapLocation}
                  onChangeText={text => handleInputChange('mapLocation', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Size (m²)</Text>
                <TextInput
                  value={formData.size}
                  onChangeText={text => handleInputChange('size', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Price (PKR/USD)</Text>
                <TextInput
                  value={formData.price}
                  onChangeText={text => handleInputChange('price', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Negotiable</Text>
                <TextInput
                  value={formData.negotiable}
                  onChangeText={text => handleInputChange('negotiable', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Rooms</Text>
                <TextInput
                  value={formData.rooms}
                  onChangeText={text => handleInputChange('rooms', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Bathrooms</Text>
                <TextInput
                  value={formData.bathrooms}
                  onChangeText={text => handleInputChange('bathrooms', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Floor Number</Text>
                <TextInput
                  value={formData.floorNumber}
                  onChangeText={text => handleInputChange('floorNumber', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Total Floors in Building
                </Text>
                <TextInput
                  value={formData.totalFloors}
                  onChangeText={text => handleInputChange('totalFloors', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Furnished</Text>
                <TextInput
                  value={formData.furnished}
                  onChangeText={text => handleInputChange('furnished', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Balcony / Terrace</Text>
                <TextInput
                  value={formData.balcony}
                  onChangeText={text => handleInputChange('balcony', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Parking</Text>
                <TextInput
                  value={formData.parking}
                  onChangeText={text => handleInputChange('parking', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Elevator</Text>
                <TextInput
                  value={formData.elevator}
                  onChangeText={text => handleInputChange('elevator', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Water / Electricity Availability
                </Text>
                <TextInput
                  value={formData.waterElectricity}
                  onChangeText={text =>
                    handleInputChange('waterElectricity', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Heating / Cooling</Text>
                <TextInput
                  value={formData.heatingCooling}
                  onChangeText={text =>
                    handleInputChange('heatingCooling', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Title Deed / Document</Text>
                <TextInput
                  value={formData.titleDeed}
                  onChangeText={text => handleInputChange('titleDeed', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Year Built / Renovated</Text>
                <TextInput
                  value={formData.yearBuilt}
                  onChangeText={text => handleInputChange('yearBuilt', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Facing Direction</Text>
                <TextInput
                  value={formData.facingDirection}
                  onChangeText={text =>
                    handleInputChange('facingDirection', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>View</Text>
                <TextInput
                  value={formData.view}
                  onChangeText={text => handleInputChange('view', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Pets Allowed</Text>
                <TextInput
                  value={formData.petsAllowed}
                  onChangeText={text => handleInputChange('petsAllowed', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Nearby Landmarks</Text>
                <TextInput
                  value={formData.nearbyLandmarks}
                  onChangeText={text =>
                    handleInputChange('nearbyLandmarks', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Monthly Maintenance Cost (PKR)
                </Text>
                <TextInput
                  value={formData.monthlyMaintenanceCost}
                  onChangeText={text =>
                    handleInputChange('monthlyMaintenanceCost', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Floor Plan</Text>
                <TextInput
                  value={formData.floorPlan}
                  onChangeText={text => handleInputChange('floorPlan', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Distance from City Center / Transport (km)
                </Text>
                <TextInput
                  value={formData.distanceFromCityCenter}
                  onChangeText={text =>
                    handleInputChange('distanceFromCityCenter', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Media (Photos 1–20 images)
                </Text>
                <TextInput
                  value={formData.media}
                  onChangeText={text => handleInputChange('media', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Video / Virtual Tour</Text>
                <TextInput
                  value={formData.videoVirtualTour}
                  onChangeText={text =>
                    handleInputChange('videoVirtualTour', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Description</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={text => handleInputChange('description', text)}
                  style={styles.input}
                />
              </View>
            </>
          )}

          {categoryType === 'jobs' && (
            <>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Job Title</Text>
                <TextInput
                  value={formData.jobTitle}
                  onChangeText={text => handleInputChange('jobTitle', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Category / Industry</Text>
                <TextInput
                  value={formData.industry}
                  onChangeText={text => handleInputChange('industry', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Employment Type</Text>
                <TextInput
                  value={formData.employmentType}
                  onChangeText={text =>
                    handleInputChange('employmentType', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Description</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={text => handleInputChange('description', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Requirements / Qualifications
                </Text>
                <TextInput
                  value={formData.requirements}
                  onChangeText={text => handleInputChange('requirements', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Company Name / Logo</Text>
                <TextInput
                  value={formData.companyName}
                  onChangeText={text => handleInputChange('companyName', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Job Location</Text>
                <TextInput
                  value={formData.jobLocation}
                  onChangeText={text => handleInputChange('jobLocation', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Experience Required (years)
                </Text>
                <TextInput
                  value={formData.experienceRequired}
                  onChangeText={text =>
                    handleInputChange('experienceRequired', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Education Required</Text>
                <TextInput
                  value={formData.educationRequired}
                  onChangeText={text =>
                    handleInputChange('educationRequired', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <TextInput
                  value={formData.skills}
                  onChangeText={text => handleInputChange('skills', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Gender Preference</Text>
                <TextInput
                  value={formData.genderPreference}
                  onChangeText={text =>
                    handleInputChange('genderPreference', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Work Timing</Text>
                <TextInput
                  value={formData.workTiming}
                  onChangeText={text => handleInputChange('workTiming', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Number of Vacancies</Text>
                <TextInput
                  value={formData.vacancies}
                  onChangeText={text => handleInputChange('vacancies', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Contract Duration (months)
                </Text>
                <TextInput
                  value={formData.contractDuration}
                  onChangeText={text =>
                    handleInputChange('contractDuration', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Application Deadline</Text>
                <TextInput
                  value={formData.applicationDeadline}
                  onChangeText={text =>
                    handleInputChange('applicationDeadline', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Contact Method</Text>
                <TextInput
                  value={formData.contactMethod}
                  onChangeText={text =>
                    handleInputChange('contactMethod', text)
                  }
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Salary (PKR/USD)</Text>
                <TextInput
                  value={formData.salary}
                  onChangeText={text => handleInputChange('salary', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Salary Type</Text>
                <TextInput
                  value={formData.salaryType}
                  onChangeText={text => handleInputChange('salaryType', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Benefits</Text>
                <TextInput
                  value={formData.benefits}
                  onChangeText={text => handleInputChange('benefits', text)}
                  style={styles.input}
                />
              </View>
            </>
          )}

          {/* Submit Button */}
          <MyButton
            title={loading ? t('submitting') : t('Submit Ad')}
            style={styles.submitButton}
            onPress={submitProduct}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.green} />
            ) : (
              <Text style={styles.submitButtonText}>{t('Submit Ad')}</Text>
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

export default CreateProduct;
