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
import {Snackbar} from 'react-native-paper'; // 👈 Import Snackbar
import {styles} from './styles';

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
      selectionLimit: 0, // 0 = allow multiple
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
      setSnackbarMessage('Something went wrong. Try again!');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Product for {name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={formData.name}
        onChangeText={text => handleInputChange('name', text)}
      />

      <TextInput
        style={[styles.input, {height: 100}]}
        placeholder="Description"
        value={formData.description}
        multiline
        onChangeText={text => handleInputChange('description', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={text => handleInputChange('price', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Stock"
        keyboardType="numeric"
        value={formData.stock}
        onChangeText={text => handleInputChange('stock', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Discount (%)"
        keyboardType="numeric"
        value={formData.discount}
        onChangeText={text => handleInputChange('discount', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Special Offer (Optional)"
        value={formData.specialOffer}
        onChangeText={text => handleInputChange('specialOffer', text)}
      />

      <Button title="Choose Images" onPress={handleChooseImages} />

      <View style={styles.imagePreviewContainer}>
        {formData.images.map((img, index) => (
          <Image
            key={index}
            source={{uri: img.uri}}
            style={styles.imagePreview}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={submitProduct}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Product</Text>
        )}
      </TouchableOpacity>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}>
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

export default CreateProduct;
