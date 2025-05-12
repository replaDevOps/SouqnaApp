import React from 'react';
import {Text, View} from 'react-native';
import styles from './style';
import {Row} from '../../atoms/row';
import Regular from '../../../typography/RegularText';
const ProductMenu = ({color, condition, material}) => {
  return (
    <View style={styles.menuContainer}>
      <Row style={styles.topItem}>
        <Regular style={styles.leftText}>Stock</Regular>
        <Regular style={styles.menuText}>{color}</Regular>
      </Row>
      <Row style={styles.menuItem}>
        <Regular style={styles.leftText}>Discounts</Regular>
        <Text style={styles.menuText} numberOfLines={1} ellipsizeMode="tail">
          {condition}
        </Text>
      </Row>
      <Row style={styles.menuItem}>
        <Regular style={styles.leftText}>Condition</Regular>
        <Regular style={styles.menuText}>{material}</Regular>
      </Row>
    </View>
  );
};

export default ProductMenu;
