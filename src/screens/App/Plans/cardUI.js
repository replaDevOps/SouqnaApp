import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import DownloadIconSvg from '../../../assets/svg/downloadSvg';
import { CardSVG, SearchSVG } from '../../../assets/svg';
import DownArrowSvg from '../../../assets/svg/down-arrow-svg';
import MasterSVG from '../../../assets/svg/masterSVG';
import { colors } from '../../../util/color';
import VisaSVG from '../../../assets/svg/VisaSVG';

const cardUI = () => {
  const [saveInfo, setSaveInfo] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
  <View style={styles.contentContainer}>
        <Text style={styles.header}>Payment method</Text>
        
        <View style={styles.paymentOption}>
          <View style={styles.radioRow}>
            <View style={styles.radioButton}>
              <View style={styles.radioInner} />
            </View>
            <CardSVG width={24} height={24} />
            <Text style={styles.optionText}>Card</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Card information</Text>
          <View style={styles.cardNumberContainer}>
            <TextInput
              style={styles.cardNumberInput}
              placeholder="1234 1234 1234 1234"
              keyboardType="numeric"
              maxLength={19}
            />
            <View style={styles.cardBrands}>
              {/* <Image source={require('./assets/visa.png')} style={styles.cardBrand} />
              <Image source={require('./assets/mastercard.png')} style={styles.cardBrand} />
              <Image source={require('./assets/amex.png')} style={styles.cardBrand} />
              <Image source={require('./assets/jcb.png')} style={styles.cardBrand} /> */}
            <VisaSVG  width={30} height={20} style={styles.cardBrand} />
            <MasterSVG  width={30} height={20} style={styles.cardBrand}/>
            </View>
          </View>
          
          <View style={styles.expiryAndCvcContainer}>
            <TextInput
              style={[styles.expiryInput, styles.halfInput]}
              placeholder="MM / YY"
              keyboardType="numeric"
              maxLength={5}
            />
            <View style={styles.cvcContainer}>
              <TextInput
                style={styles.cvcInput}
                placeholder="CVC"
                keyboardType="numeric"
                maxLength={4}
              />
              <TouchableOpacity style={styles.cvcHelpIcon}>
                <DownloadIconSvg width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Cardholder name</Text>
          <TextInput
            style={styles.fullInput}
            placeholder="Full name on card"
          />
          
          <Text style={styles.sectionTitle}>Country or region</Text>
          <TouchableOpacity style={styles.countrySelector}>
            <Text>Pakistan</Text>
            <DownArrowSvg width={30} height={20} fill={colors.black}/>
          </TouchableOpacity>
        </View>
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setSaveInfo(!saveInfo)}
          >
            {saveInfo && (
              <View style={styles.checkmarkContainer}>
                <Text>✔</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxTitle}>
              Yes, I agree with terms and conditions
            </Text>
            {/* <Text style={styles.checkboxSubtitle}>
              Pay faster on Blackbox and everywhere Link is accepted.
            </Text> */}
          </View>
        </View>
        
        <TouchableOpacity style={styles.startTrialButton}>
          <Text style={styles.startTrialText}>Start trial</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    flexDirection:'column',
    backgroundColor: colors.white,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentOption: {
    backgroundColor: 'rgba(179, 176, 176, 0.09)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
  },
  cardNumberInput: {
    flex: 1,
    padding: 10,
  },
  cardBrands: {
    flexDirection: 'row',
    paddingRight: 8,
  },
  cardBrand: {
    // width: 30,
    // height: 20,
    marginLeft: 4,
  },
  expiryAndCvcContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfInput: {
    width: '48%',
  },
  expiryInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  cvcContainer: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvcInput: {
    flex: 1,
    padding: 10,
  },
  cvcHelpIcon: {
    marginRight: 8,
  },
  fullInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  countrySelector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  startTrialButton: {
    backgroundColor: '#20C997',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  startTrialText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollViewContent: {
  flexGrow: 1,
  justifyContent: 'center',
},
contentContainer: {
//   padding: 16,
  width: '100%',
},
});

export default cardUI;