/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../../util/color';
import {mvs, width} from '../../../util/metrices';
import {CrossIconSVG} from '../../../assets/svg';
import {useTranslation} from 'react-i18next';
import CustomText from '../../CustomText';

const PrimaryPasswordInput = ({
  placeholder,
  leftIcon,
  rightIcon,
  value,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  secureTextEntry,
  error,
  touched,
  editable,
  style,
  containerStyle,
  clearText,
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure);
  };
  const {i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <View
      style={[
        styles.inputContainer,
        containerStyle,
        {
          borderColor: error ? colors.red : colors.black,
          borderWidth: mvs(1.4),
        },
      ]}>
      {leftIcon && leftIcon}
      <TextInput
        editable={editable}
        placeholder={placeholder}
        value={value}
        autoCapitalize="none"
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={isSecure}
        style={[
          styles.input,
          {
            textAlign: isArabic ? 'right' : 'left',
            writingDirection: isArabic ? 'rtl' : 'ltr',
          },
          style,
        ]}
        placeholderTextColor={colors.grey}
        keyboardType={keyboardType}
      />
      {value && placeholder === 'E-Mail' && (
        <TouchableOpacity onPress={clearText}>
          <CrossIconSVG width={20} height={20} />
        </TouchableOpacity>
      )}
      {rightIcon && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          {React.cloneElement(rightIcon, {
            style: [rightIcon.props.style, styles.iconStyle],
          })}
        </TouchableOpacity>
      )}
      {error && <CustomText style={styles.errorText}>{error}</CustomText>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: mvs(13),
    flexDirection: 'row',
    gap: mvs(7),
    borderWidth: mvs(1),
    borderColor: colors.black,
    borderRadius: mvs(8),
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: mvs(2),
    marginBottom: mvs(10),
  },
  input: {
    fontSize: mvs(14),
    color: colors.black,
    width: width - mvs(100),
    height: mvs(40),
  },
  errorText: {
    position: 'absolute',
    color: colors.red,
    fontSize: mvs(12),
    fontWeight: '500',
    bottom: -16,
  },
});

export default PrimaryPasswordInput;
