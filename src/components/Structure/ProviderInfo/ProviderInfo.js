import React from 'react';
import {View} from 'react-native';
import {Row} from '../../atoms/row';
import {WorldSVG, ProfileSVG, ActiveSVG} from '../../../assets/svg';
import Line from '../../atoms/InputFields/Line';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import styles from './style';

const ProviderInfo = ({provider}) => {
  return (
    <View style={styles.providerContainer}>
      <Bold style={styles.providerTitle}>Provider</Bold>
      <Line />
      <Bold style={styles.providerName}>{provider.name}</Bold>
      <Regular style={styles.display}>3 Display Online</Regular>

      <View style={styles.attributes}>
        <View style={styles.attributeBox}>
          <Regular style={styles.leftText}>
            <WorldSVG width={13} height={13} /> {provider.customerSatisfaction}
          </Regular>
        </View>
        <View style={styles.attributeBox}>
          <Regular style={styles.leftText}>
            <WorldSVG width={13} height={13} /> {provider.providerAttributes}
          </Regular>
        </View>
      </View>
      <View style={styles.attributeBox1}>
        <Regular style={styles.attributeText}>
          <WorldSVG width={13} height={13} /> {provider.providerFriendly}
        </Regular>
      </View>

      <View style={{paddingVertical: 10}}>
        <Row>
          <Regular>
            <ProfileSVG width={15} height={15} /> {provider.providerType}
          </Regular>
        </Row>
      </View>

      <Row>
        <Regular>
          <ActiveSVG width={15} height={15} /> {'Active Since '}
          {provider.activeSince}
        </Regular>
      </Row>
    </View>
  );
};

export default ProviderInfo;
