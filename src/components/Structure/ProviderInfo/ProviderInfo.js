import {View, TouchableOpacity} from 'react-native';
import {Row} from '../../atoms/row';
import {ProfileSVG, ActiveSVG} from '../../../assets/svg';
import Line from '../../atoms/InputFields/Line';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import styles from './style';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

const ProviderInfo = ({provider}) => {
  const {t, i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';
  const roleText =
    provider?.user?.role === '2'
      ? t('seller')
      : provider?.user?.role === '3'
      ? t('buyer')
      : t('seller');
  const navigation = useNavigation();
  return (
    <View style={styles.providerContainer}>
      <Bold style={styles.providerTitle}>{t('Provider')}</Bold>
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
          <Regular style={styles.leftText}>
            {isArabic ? provider.category?.ar_name : provider.category?.name}
          </Regular>
        </View>
        <View style={styles.attributeBox}>
          <Regular style={styles.leftText}>
            {isArabic
              ? provider.sub_category?.ar_name
              : provider.sub_category?.name}
          </Regular>
        </View>
      </View>

      <TouchableOpacity
        style={{paddingVertical: 10}}
        onPress={() => {
          console.log(
            'Provider email:',
            provider.user?.email || provider.seller?.email,
          );
          navigation.navigate('SellerProfile', {
            sellerId: provider.user?.id || provider.seller?.id,
          });
        }}>
        <Row>
          <Regular>
            <ProfileSVG width={15} height={15} />
            {'  '}
            {provider.user?.email || provider.seller?.email}
          </Regular>
        </Row>
      </TouchableOpacity>

      <Row>
        <Regular>
          <ActiveSVG width={15} height={15} /> {t('activeSince')}
          {provider.date}
        </Regular>
      </Row>
    </View>
  );
};

export default ProviderInfo;
