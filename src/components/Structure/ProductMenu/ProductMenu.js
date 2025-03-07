import React from 'react';
import {View} from 'react-native';
import styles from './style';
import {Row} from '../../atoms/row';
import Regular from '../../../typography/RegularText';
const ProductMenu = ({color, condition, material}) => {
  return (
    <View style={styles.menuContainer}>
      <Row style={styles.topItem}>
        <Regular style={styles.leftText}>Color</Regular>
        <Regular style={styles.menuText}>{color}</Regular>
      </Row>
      <Row style={styles.menuItem}>
        <Regular style={styles.leftText}>Condition</Regular>
        <Regular style={styles.menuText}>{condition}</Regular>
      </Row>
      <Row style={styles.menuItem}>
        <Regular style={styles.leftText}>Material</Regular>
        <Regular style={styles.menuText}>{material}</Regular>
      </Row>
    </View>
  );
};

export default ProductMenu;
