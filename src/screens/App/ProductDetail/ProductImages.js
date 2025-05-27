/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {BASE_URL_Product} from '../../../api/apiServices';

const {width, height} = Dimensions.get('window');

const ProductImages = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / width);
    setActiveIndex(currentIndex);
  };
  const openPreview = imageUri => {
    setPreviewImage(imageUri);
    setModalVisible(true);
  };
  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{width: width, height: height * 0.35}}>
        {images.map((img, index) => {
          const uri = `${BASE_URL_Product}${img.path}`;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => openPreview(uri)}>
              <Image
                source={{uri}}
                style={{
                  width: width,
                  height: height * 0.35,
                  resizeMode: 'cover',
                  backgroundColor: '#fff',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white
            // backdropFilter: 'blur(8px)', // Not supported on RN yet; use BlurView if needed
          }}>
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === activeIndex ? '#000' : '#888',
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>
      </View>
      {/* Modal for preview */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}>
          <Image
            source={{uri: previewImage}}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: width,
    height: height,
  },
});
export default ProductImages;
