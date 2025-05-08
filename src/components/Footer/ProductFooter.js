import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {mvs} from '../../util/metrices';
import {colors} from '../../util/color';
import {CartSVG, ChatSVG} from '../../assets/svg';
import { useNavigation } from '@react-navigation/native';


const ProductFooter = ({onBuyPress, loading}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.footerContainer}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.buyButton]} onPress={()=>navigation.navigate('Chat')}>
          <ChatSVG width={24} height={24} />
          {loading ? (
            <ActivityIndicator size="small" color={colors.green} />
          ) : (
            <Text style={styles.buttonText}>Chat with Selleer</Text> 
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buyButton]} onPress={onBuyPress}>
          <CartSVG width={24} height={24} />
          {loading ? (
            <ActivityIndicator size="small" color={colors.green} />
          ) : (
            <Text style={styles.buttonText}>Buy Directly</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductFooter;

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: mvs(10),
    paddingTop: mvs(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: mvs(10),
  },
  button: {
    flex: 1,
    paddingVertical: mvs(2),
    marginHorizontal: mvs(5),
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.grey,
    borderRadius: mvs(25),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buyButton: {
    flex: 1,
    paddingVertical: mvs(12),
    marginHorizontal: mvs(5),
    borderRadius: mvs(25),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.lightgreen,
  },
  buttonText: {
    color: colors.green,
    fontSize: mvs(16),
    marginLeft: mvs(10),
    fontWeight: 'bold',
  },
});
