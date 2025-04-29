import React from 'react';
import {View} from 'react-native';
import {Row} from '../../atoms/row';
import {WorldSVG, ProfileSVG, ActiveSVG} from '../../../assets/svg';
import Line from '../../atoms/InputFields/Line';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import styles from './style';

const ProviderInfo = ({provider}) => {
  const roleText =
    provider?.user?.role === '2'
      ? 'Seller'
      : provider?.user?.role === '3'
      ? 'Buyer'
      : 'Unknown';
  return (
    <View style={styles.providerContainer}>
      <Bold style={styles.providerTitle}>Provider</Bold>
      <Line />
      <Bold style={styles.providerName}>{provider.user?.name}</Bold>
      <Regular style={styles.display}>{roleText}</Regular>

      <View style={styles.attributes}>
        <View style={styles.attributeBox}>
          <Regular style={styles.leftText}>{provider.category?.name}</Regular>
        </View>
        <View style={styles.attributeBox}>
          <Regular style={styles.leftText}>
            <WorldSVG width={13} height={13} /> {provider.sub_category?.name}
          </Regular>
        </View>
      </View>

      <View style={{paddingVertical: 10}}>
        <Row>
          <Regular>
            <ProfileSVG width={15} height={15} />
            {'  '}
            {provider.user?.email}
          </Regular>
        </Row>
      </View>

      <Row>
        <Regular>
          <ActiveSVG width={15} height={15} /> {'Active Since '}
          {provider.date}
        </Regular>
      </Row>
    </View>
  );
};

export default ProviderInfo;
