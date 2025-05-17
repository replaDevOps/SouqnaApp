import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../util/color';
import { mvs } from '../../util/metrices';
import { t } from 'i18next';
import { useSelector } from 'react-redux';

// RadioGroup component for seller type selection
const RadioGroup = ({ options, selectedOption, onSelect }) => {
    return (
        <View style={styles.radioGroupContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={styles.radioOptionContainer}
                    onPress={() => onSelect(option.value)}>
                    <View style={styles.radioOuterCircle}>
                        {selectedOption === option.value && <View style={styles.radioInnerCircle} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default function SwitchModal({
    visible,
    onClose,
    role,
    token,
    password,
    onSubmit,
    isLoading = false,
}) {
    const [sellerType, setSellerType] = useState('1'); // Default to Private (1)
    const [error, setError] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const currentRole = role;
    const { actualRole } = useSelector(state => state.user);

    const handleSubmit = () => {
       if(password===NewPassword){

           // For role 3 (buyer switching to seller), pass token, currentRole, sellerType
           if (role === '3' || role === 3) {
               onSubmit(token, currentRole, sellerType);
           } else {
               // For role 2 (seller switching to buyer), pass token and currentRole
               onSubmit(token, currentRole);
           }
    
           // Reset state
           setError('');
           setNewPassword('');
       }else{
        setError('Passwords do not match');
       }

    };

   // If actualRole is 4, don't show the modal
    // This prevents role 4 users from seeing the modal when they toggle between views
    if (actualRole === '4' || actualRole === 4) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            {(role === '2' || role === 2)
                                ? t('Switch to Buyer Account')
                                : t('Switch to Seller Account')}
                        </Text>

                        {/* Show RadioGroup only for role 3 (buyer switching to seller) */}
                        {(role === '3' || role === 3) && (
                            <View style={styles.sellerTypeContainer}>
                                <Text style={styles.sellerTypeLabel}>{t('Select Seller Type')}</Text>
                                <RadioGroup
                                    options={[
                                        { value: '1', label: t('Private') },
                                        { value: '2', label: t('Company') },
                                    ]}
                                    selectedOption={sellerType}
                                    onSelect={(value) => {
                                        console.log('Selected seller type:', value);
                                        setSellerType(value);
                                    }}
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t('Please confirm your Password')}</Text>
                            <TextInput
                                style={styles.input}
                                value={NewPassword}
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    if (error) setError('');
                                }}
                                placeholder={t('Password')}
                                secureTextEntry
                                placeholderTextColor={colors.grey}
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                                disabled={isLoading}>
                                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={handleSubmit}
                                disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color={colors.white} />
                                ) : (
                                    <Text style={styles.submitButtonText}>{t('Submit')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderRadius: mvs(12),
        padding: mvs(20),
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: mvs(18),
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: mvs(16),
        textAlign: 'center',
    },
    sellerTypeContainer: {
        marginBottom: mvs(16),
    },
    sellerTypeLabel: {
        fontSize: mvs(16),
        fontWeight: '500',
        color: colors.black,
        marginBottom: mvs(8),
    },
    radioGroupContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: mvs(8),
    },
    radioOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: mvs(16),
    },
    radioOuterCircle: {
        height: mvs(20),
        width: mvs(20),
        borderRadius: mvs(10),
        borderWidth: 2,
        borderColor: colors.lightorange,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInnerCircle: {
        height: mvs(10),
        width: mvs(10),
        borderRadius: mvs(5),
        backgroundColor: colors.lightorange,
    },
    radioLabel: {
        marginLeft: mvs(8),
        fontSize: mvs(14),
        color: colors.black,
    },
    inputContainer: {
        marginBottom: mvs(16),
    },
    inputLabel: {
        fontSize: mvs(16),
        fontWeight: '500',
        color: colors.black,
        marginBottom: mvs(8),
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: mvs(8),
        padding: mvs(12),
        fontSize: mvs(14),
        color: colors.black,
    },
    errorText: {
        color: 'red',
        fontSize: mvs(12),
        marginTop: mvs(4),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: mvs(16),
    },
    button: {
        borderRadius: mvs(8),
        paddingVertical: mvs(12),
        paddingHorizontal: mvs(16),
        minWidth: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    submitButton: {
        backgroundColor: colors.lightorange,
    },
    cancelButtonText: {
        color: colors.black,
        fontWeight: '500',
        fontSize: mvs(14),
    },
    submitButtonText: {
        color: colors.white,
        fontWeight: '500',
        fontSize: mvs(14),
    },
});