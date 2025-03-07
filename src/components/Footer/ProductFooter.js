import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {mvs} from '../../util/metrices';
import {colors} from '../../util/color';
import {CartSVG, ChatSVG} from '../../assets/svg';

const ProductFooter = ({onChatPress, onBuyPress}) => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onChatPress}>
          <ChatSVG />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.buyButton]} onPress={onBuyPress}>
          <CartSVG width={24} height={24} />
          <Text style={styles.buttonText}>Buy Directly</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductFooter;

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    paddingBottom: mvs(10),
    paddingTop: mvs(10),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: mvs(15),
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
    paddingVertical: mvs(8),
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
