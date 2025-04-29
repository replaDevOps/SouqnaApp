import React from 'react';
import {View} from 'react-native';
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
        <Regular style={styles.leftText}>Description</Regular>
        <Regular style={styles.menuText}>{condition}</Regular>
      </Row>
      <Row style={styles.menuItem}>
        <Regular style={styles.leftText}>User</Regular>
        <Regular style={styles.menuText}>{material}</Regular>
      </Row>
    </View>
  );
};

export default ProductMenu;
