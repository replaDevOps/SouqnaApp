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
  });

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      data.append('images[]', {
        uri: image.uri,
        name: image.fileName || `photo_${index}.jpg`,
        type: image.type || 'image/jpeg',
      });
    });

    data.append('stock', formData.stock);
    data.append('discount', formData.discount);
    data.append('specialOffer', formData.specialOffer);

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
    <View style={{flex: 1}}>
      <MainHeader title={`Create Product for ${name}`} showBackIcon={true} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Name */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={formData.name}
          onChangeText={text => handleInputChange('name', text)}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, {height: 100}]}
          placeholder="Enter product description"
          value={formData.description}
          multiline
          onChangeText={text => handleInputChange('description', text)}
        />

        {/* Price */}
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
          value={formData.price}
          onChangeText={text => handleInputChange('price', text)}
        />

        {/* Stock */}
        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter available stock"
          keyboardType="numeric"
          value={formData.stock}
          onChangeText={text => handleInputChange('stock', text)}
        />

        {/* Discount */}
        <Text style={styles.label}>Discount (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter discount percentage"
          keyboardType="numeric"
          value={formData.discount}
          onChangeText={text => handleInputChange('discount', text)}
        />

        {/* Special Offer */}
        <Text style={styles.label}>Special Offer (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter special offer"
          value={formData.specialOffer}
          onChangeText={text => handleInputChange('specialOffer', text)}
        />

        {/* Choose Images Button */}
        <MyButton title="Choose Images" onPress={handleChooseImages} />

        <View style={styles.imagePreviewContainer}>
          {formData.images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{uri: img.uri}} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => handleRemoveImage(index)}>
                <Text style={styles.removeIconText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <MyButton
          title={'Submit Product'}
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
    </View>
  );
};

export default CreateProduct;
