import React from 'react';
import {Button, View, Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';

const ImageSelector = ({onImageSelected}) => {
  const {t} = useTranslation();
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 800, // Adjust dimensions
      height: 800,
      cropping: true,
      cropperToolbarTitle: 'Crop Image',
      compressImageQuality: 0.8,
      cropperCircleOverlay: false,
      freeStyleCropEnabled: false,
      cropperActiveWidgetColor: '#000',
      cropperStatusBarColor: '#000',
      cropperToolbarColor: '#fff',
      cropperToolbarWidgetColor: '#000',
      mediaType: 'photo',
      cropperChooseText: t('selectField'),
      cropperCancelText: t('Cancel'),
      cropperAspectRatio: {
        x: 1,
        y: 1, // Lock aspect ratio (e.g., square)
      },
    })
      .then(image => {
        onImageSelected(image);
      })
      .catch(err => {
        if (err.message !== 'User cancelled image selection') {
          Alert.alert(t('error'), err.message);
        }
      });
  };

  return (
    <View style={{marginVertical: 10}}>
      <Button title="Pick Image" onPress={pickImage} />
    </View>
  );
};

export default ImageSelector;
