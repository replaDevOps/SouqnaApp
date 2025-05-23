import React from 'react';
import {Image, View} from 'react-native';
import {Row} from '../../atoms/row';
import {WorldSVG, ProfileSVG, ActiveSVG} from '../../../assets/svg';
import Line from '../../atoms/InputFields/Line';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import styles from './style';
import {BASE_URL_Product} from '../../../api/apiServices';

const ProviderInfo = ({provider}) => {
  const roleText =
    provider?.user?.role === '2'
      ? 'Seller'
      : provider?.user?.role === '3'
      ? 'Buyer'
      : 'Seller';
  return (
    <View style={styles.providerContainer}>
      <Bold style={styles.providerTitle}>Provider</Bold>
      <Line />
      <Bold style={styles.providerName}>
        {provider.user?.name || provider.seller?.name}
      </Bold>
      <Regular style={styles.display}>{roleText}</Regular>

      {/* <View style={{marginVertical: 10}}>
        {provider.category?.image ? (
          <Image
            source={{uri: `${BASE_URL_Product}${provider.category.image}`}}
            style={{width: 50, height: 50, resizeMode: 'contain'}} // Customize the style as needed
          />
        ) : null}
      </View> */}

      <View style={styles.attributes}>
        <View style={styles.attributeBox}>
          <Regular style={styles.leftText}>{provider.category?.name}</Regular>
        </View>
        <View style={styles.attributeBox}>
          {' '}
          <Regular style={styles.leftText}>
            {provider.sub_category?.name}
          </Regular>
        </View>
      </View>

      <View style={{paddingVertical: 10}}>
        <Row>
          <Regular>
            <ProfileSVG width={15} height={15} />
            {'  '}
            {provider.user?.email || provider.seller?.email}
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
