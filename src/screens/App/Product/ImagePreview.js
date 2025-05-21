import React from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

const ImagePreview = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {uri} = route.params;

  return (
    <View style={{flex: 1, backgroundColor: 'black', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{position: 'absolute', top: 50, right: 20, zIndex: 10}}>
        <Text style={{color: 'white', fontSize: 18}}>Close</Text>
      </TouchableOpacity>
      <Image
        source={{uri}}
        style={{width: '100%', height: '100%', resizeMode: 'contain'}}
      />
    </View>
  );
};

export default ImagePreview;
