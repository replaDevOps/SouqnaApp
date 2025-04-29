import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
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
import {
  CloseSvg,
  HOMESVG,
  OpenSVG,
  SearchSVG,
  UploadSVG,
} from '../../../../assets/svg';

const CreateProduct = () => {
  const route = useRoute();
  const {id: subCategoryId, categoryId, name} = route.params;
  const {token} = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    discount: '',
    specialOffer: '',
    images: [],
    location: 'Murree Road, Pakistan',
    lat: '33.6938',
    long: '73.0652',
  });

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const conditionValue =
    selectedCondition === 'New' ? 1 : selectedCondition === 'Used' ? 2 : null;
  if (conditionValue === null) {
    setSnackbarMessage('Please select the condition.');
    setSnackbarVisible(true);
    return;
  }

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

  const submitProduct = async () => {
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
        setSnackbarMessage('Product created successfully!');
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
        'Something went wrong. Try again!';

      // Check if 403 error (profile not verified)
      if (error.response?.status === 403) {
        errorMessage = 'Your profile is not verified yet.';
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={`Post Your Product`} showBackIcon={true} />

      <ScrollView
        style={{
          paddingHorizontal: mvs(15),
          paddingTop: mvs(25),
          backgroundColor: colors.white,
        }}
        contentContainerStyle={{paddingBottom: mvs(60)}}>
        {/* Category Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryBox}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../../../assets/img/phone.png')}
                style={styles.categoryImage}
              />
              <View style={{marginLeft: mvs(10)}}>
                <Text style={styles.categoryTitle}>Mobiles</Text>
                <Text style={styles.categorySubtitle}>{name}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Image Upload Section */}
          <View style={styles.uploadBox}>
            {formData.images.length === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleChooseImages}>
                <Text style={styles.addButtonText}>Add images</Text>
              </TouchableOpacity>
            ) : (
              // After image is added
              <View>
                {formData.images.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={[{isUploadIcon: true}, ...formData.images]}
                      keyExtractor={(item, index) => index.toString()}
                      contentInset={{ right: 25 }}
                      contentContainerStyle={styles.flatListContainer}
                      renderItem={({ item, index }) =>
                        item.isUploadIcon ? (
                          <TouchableOpacity
                            onPress={handleChooseImages}
                            style={styles.iconRow}>
                            <UploadSVG
                              width={22}
                              height={22}
                              style={styles.uploadIcon}
                            />
                            <Text style={styles.uploadText}>Upload Image</Text>
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
            <View>
              {/* Display Selected Images */}

            </View>

            <Text style={styles.noteText}>
              For the cover picture we recommend using the landscape mode.
            </Text>
          </View>
        </View>

        {/* Condition Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Condition
            <Text style={{color: colors.red}}>*</Text>
          </Text>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[
                styles.conditionButton,
                selectedCondition === 'New' && styles.selectedCondition,
              ]}
              onPress={() => handleConditionSelect('New')}>
              <Text style={styles.conditionText}>New</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.conditionButton,
                selectedCondition === 'Used' && styles.selectedCondition,
              ]}
              onPress={() => handleConditionSelect('Used')}>
              <Text style={styles.conditionText}>Used</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Name
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            placeholderTextColor={colors.grey}
            value={formData.name}
            onChangeText={text => handleInputChange('name', text)}
          />
        </View>

        {/* Description Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Description
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, {height: mvs(100)}]}
            placeholder="Enter product description......"
            placeholderTextColor={colors.grey}
            value={formData.description}
            multiline
            onChangeText={text => handleInputChange('description', text)}
          />
        </View>

        {/* Location Section - Fixed */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Location
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <View style={styles.locationContainer}>
            <SearchSVG width={25} height={25} />
            <TextInput
              style={styles.locationText}
              placeholder="Enter Location....."
              placeholderTextColor={colors.grey}
              value={formData.location}
              onChangeText={text => handleInputChange('location', text)}
            />
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Price
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            placeholderTextColor={colors.grey}
            keyboardType="numeric"
            value={formData.price}
            onChangeText={text => handleInputChange('price', text)}
          />
        </View>

        {/* Discount Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Discount
            {/* <Text style={{color: colors.red}}>*</Text> */}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter discount percentage"
            keyboardType="numeric"
            placeholderTextColor={colors.grey}
            value={formData.discount}
            onChangeText={text => handleInputChange('discount', text)}
          />
        </View>

        {/* Special Offer Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Special Offer
            {/* <Text style={{color: colors.red}}>*</Text> */}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter special offer"
            placeholderTextColor={colors.grey}
            value={formData.specialOffer}
            onChangeText={text => handleInputChange('specialOffer', text)}
          />
        </View>

        {/* Stock Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Available Stock
            <Text style={{color: colors.red}}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter available stock"
            placeholderTextColor={colors.grey}
            keyboardType="numeric"
            value={formData.stock}
            onChangeText={text => handleInputChange('stock', text)}
          />
        </View>

        {/* Submit Button */}
        <MyButton
          title={loading ? 'Submitting...' : 'Submit Product'}
          style={styles.submitButton}
          onPress={submitProduct}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.green} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Product</Text>
          )}
        </MyButton>
      </ScrollView>

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
