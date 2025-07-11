import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';
import {useTranslation} from 'react-i18next';

// Simple Dropdown Component
const CustomDropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = option => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <View style={dropdownStyles.container}>
      <TouchableOpacity
        style={[dropdownStyles.selector, isOpen && dropdownStyles.selectorOpen]}
        onPress={() => setIsOpen(!isOpen)}>
        <Text
          style={[
            dropdownStyles.selectorText,
            !selectedValue && dropdownStyles.placeholderText,
          ]}>
          {selectedValue || placeholder}
        </Text>
        <Text style={[dropdownStyles.arrow, isOpen && dropdownStyles.arrowUp]}>
          ▼
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={dropdownStyles.optionsContainer}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  dropdownStyles.option,
                  selectedValue === item && dropdownStyles.selectedOption,
                ]}
                onPress={() => handleSelect(item)}>
                <Text
                  style={[
                    dropdownStyles.optionText,
                    selectedValue === item && dropdownStyles.selectedOptionText,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

// Enhanced Category Fields Component
const CategoryFields = ({categoryFields, formData, handleInputChange}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';

  console.log('Current Language:', i18n.language); // Debug: Check current language

  const renderField = (field, index) => {
    const fieldValue = formData[field.name] || '';
    const label = isArabic ? field.ar_label : field.label;
    const placeholder = isArabic
      ? `اختر ${field.ar_label}`
      : `Select ${field.label.toLowerCase()}`;

    console.log(`Field Label (${field.name}):`, label); // Debug: Check field label

    const parseOptions = options => {
      if (!options) return [];
      return options.split(',').map(option => option.trim());
    };

    switch (field.type) {
      case 'text':
        return (
          <View key={index} style={fieldStyles.fieldContainer}>
            <Text style={fieldStyles.fieldLabel}>
              {label}
              {field.required === 1 && (
                <Text style={fieldStyles.required}>*</Text>
              )}
            </Text>
            <TextInput
              style={[fieldStyles.textInput, isArabic && {textAlign: 'right'}]}
              placeholder={label}
              placeholderTextColor={colors.grey}
              value={fieldValue}
              onChangeText={text => handleInputChange(field.name, text)}
              multiline={
                field.name.includes('description') ||
                field.name.includes('requirement')
              }
              numberOfLines={
                field.name.includes('description') ||
                field.name.includes('requirement')
                  ? 4
                  : 1
              }
            />
          </View>
        );

      case 'select':
        const options = parseOptions(field.options);
        return (
          <View key={index} style={fieldStyles.fieldContainer}>
            <Text style={fieldStyles.fieldLabel}>
              {label}
              {field.required === 1 && (
                <Text style={fieldStyles.required}>*</Text>
              )}
            </Text>
            <CustomDropdown
              options={options}
              selectedValue={fieldValue}
              onSelect={value => handleInputChange(field.name, value)}
              placeholder={placeholder}
              label={label}
            />
          </View>
        );

      case 'radio':
        const radioOptions = parseOptions(field.options);
        return (
          <View key={index} style={fieldStyles.fieldContainer}>
            <Text style={fieldStyles.fieldLabel}>
              {label}
              {field.required === 1 && (
                <Text style={fieldStyles.required}>*</Text>
              )}
            </Text>
            <View style={fieldStyles.radioContainer}>
              {radioOptions.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={fieldStyles.radioOption}
                  onPress={() => handleInputChange(field.name, option)}>
                  <View style={fieldStyles.radioWrapper}>
                    <View
                      style={[
                        fieldStyles.radioOuter,
                        fieldValue === option && fieldStyles.radioOuterSelected,
                      ]}>
                      {fieldValue === option && (
                        <View style={fieldStyles.radioInner} />
                      )}
                    </View>
                  </View>
                  <Text style={fieldStyles.radioText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (!categoryFields || categoryFields.length === 0) {
    return null;
  }

  return (
    <View style={fieldStyles.sectionContainer}>
      {/* Toggle Button */}
      {!isExpanded && (
        <TouchableOpacity
          style={fieldStyles.toggleButton}
          onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={fieldStyles.toggleButtonText}>
            {isArabic
              ? 'انقر لعرض معلومات اضافية'
              : 'Click to expand additional information'}
            {isExpanded ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Collapsible Fields */}
      {isExpanded && (
        <View style={fieldStyles.fieldsContainer}>
          {categoryFields.map((field, index) => renderField(field, index))}

          {/* Close Button at the bottom */}
          <TouchableOpacity
            style={fieldStyles.closeButton}
            onPress={() => setIsExpanded(false)}>
            <Text style={fieldStyles.closeButtonText}>
              {isArabic
                ? 'إغلاق المعلومات الاضافية'
                : 'Close additional information'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles for the dropdown
const dropdownStyles = StyleSheet.create({
  container: {
    marginTop: mvs(5),
    position: 'relative',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 13,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  selectorOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: 'transparent',
  },
  selectorText: {
    fontSize: mvs(16),
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: colors.grey,
  },
  arrow: {
    fontSize: mvs(16),
    color: colors.black,
    transform: [{rotate: '0deg'}],
  },
  arrowUp: {
    transform: [{rotate: '180deg'}],
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 999,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: colors.lightgreen || '#e8f5e8',
  },
  optionText: {
    fontSize: mvs(16),
    color: '#333',
  },
  selectedOptionText: {
    color: colors.green || '#2e7d2e',
    fontWeight: '600',
  },
});

// Styles for the fields
const fieldStyles = StyleSheet.create({
  sectionContainer: {
    marginBottom: mvs(20),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: mvs(15),
  },
  toggleButton: {
    borderRadius: 8,
  },
  toggleButtonText: {
    color: colors.black,
    fontSize: mvs(16),
    fontWeight: '600',
  },
  fieldsContainer: {
    marginTop: mvs(10),
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: mvs(10),
    paddingHorizontal: mvs(15),
    borderRadius: 6,
    alignItems: 'center',
    marginTop: mvs(15),
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  closeButtonText: {
    color: colors.grey || '#666666',
    fontSize: mvs(14),
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: mvs(15),
  },
  fieldLabel: {
    fontSize: mvs(16),
    fontWeight: '600',
    marginBottom: mvs(8),
    color: '#333',
  },
  required: {
    color: colors.red || '#ff0000',
  },
  textInput: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: '#cccccc',
    padding: 13,
    borderRadius: 5,
    fontSize: mvs(16),
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: mvs(5),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: mvs(20),
    marginBottom: mvs(10),
  },
  radioWrapper: {
    height: mvs(20),
    width: mvs(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    height: mvs(20),
    width: mvs(20),
    borderRadius: mvs(10),
    borderWidth: 2,
    borderColor: colors.grey || '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.lightgreen || '#4CAF50',
  },
  radioInner: {
    height: mvs(10),
    width: mvs(10),
    borderRadius: mvs(5),
    backgroundColor: colors.green || '#4CAF50',
  },
  radioText: {
    marginLeft: mvs(8),
    fontSize: mvs(16),
    color: '#333',
  },
});

export default CategoryFields;
