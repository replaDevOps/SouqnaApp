import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {useTranslation} from 'react-i18next';

const CarDetailsCard = ({ProductData}) => {
  const {i18n, t} = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse custom fields data
  const parseCustomFields = customFieldsData => {
    if (!customFieldsData) return [];

    try {
      // If it's already an array, return it
      if (Array.isArray(customFieldsData)) {
        return customFieldsData;
      }

      // If it's a string, parse it
      if (typeof customFieldsData === 'string') {
        const parsed = JSON.parse(customFieldsData);
        return Array.isArray(parsed) ? parsed : [];
      }

      return [];
    } catch (error) {
      console.error('Error parsing custom fields:', error);
      console.log('Custom fields data:', customFieldsData);
      return [];
    }
  };

  // Format field names for better display
  const formatFieldName = fieldName => {
    if (!fieldName) return '';

    // Handle camelCase and snake_case
    const formatted = isArabic
      ? fieldName.replace(/_/g, ' ')
      : fieldName
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
          .replace(/_/g, ' ') // Replace underscores with spaces
          .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word

    return formatted;
  };

  // Format field values for better display
  const formatFieldValue = value => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? t('Yes') : t('No');
    if (typeof value === 'string' && value.trim() === '') return t('N/A');
    return String(value);
  };

  // Get all details from custom fields
  const customFields = parseCustomFields(ProductData);
  console.log('Parsed custom fields:', customFields);
  const allDetails = customFields.map(field => ({
    label: formatFieldName(
      isArabic ? field.ar_name || field.name : field.name || field.ar_name,
    ),
    value: formatFieldValue(
      isArabic ? field.ar_value || field.value : field.value || field.ar_value,
    ),
  }));

  // If no custom fields, show a message
  if (allDetails.length === 0) {
    return;
  }

  const initialShowCount = 6;
  const visibleDetails = isExpanded
    ? allDetails
    : allDetails.slice(0, initialShowCount);
  const remainingCount = allDetails.length - initialShowCount;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const DetailRow = ({label, value, isLast = false}) => (
    <View style={[styles.detailRow, !isLast && styles.borderBottom]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        {visibleDetails.map((detail, index) => (
          <DetailRow
            key={index}
            label={detail.label}
            value={detail.value}
            isLast={index === visibleDetails.length - 1 && remainingCount === 0}
          />
        ))}
      </View>

      {remainingCount > 0 && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={toggleExpansion}
            style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isExpanded
                ? t('viewLess')
                : `${t('view')} +${remainingCount} ${t('more')}`}{' '}
              <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: mvs(12),
    marginVertical: mvs(12),
    marginHorizontal: mvs(12),
    borderWidth: 1,
    borderColor: 'rgba(17, 14, 14, 0.18)',
  },
  detailsContainer: {
    // Container for all detail rows
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: mvs(44), // Ensure consistent row height
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 14, 14, 0.18)',
  },
  label: {
    fontSize: mvs(14),
    paddingVertical: mvs(12),
    paddingLeft: mvs(16),
    backgroundColor: '#F2F4F5',
    color: '#6b7280',
    fontWeight: '400',
    flex: 0.6, // Adjusted for better proportion
    textAlignVertical: 'center',
  },
  value: {
    paddingLeft: mvs(16),
    paddingRight: mvs(16),
    paddingVertical: mvs(12),
    fontSize: mvs(14),
    color: '#111827',
    fontWeight: '600',
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  toggleContainer: {
    paddingHorizontal: mvs(16),
    paddingVertical: mvs(12),
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    alignItems: 'center',
  },
  toggleButton: {
    width: '100%',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: mvs(14),
    color: '#3b82f6',
    fontWeight: '500',
  },
  arrow: {
    fontSize: mvs(12),
    color: '#3b82f6',
  },
  noDataContainer: {
    paddingVertical: mvs(20),
    paddingHorizontal: mvs(16),
    alignItems: 'center',
  },
  noDataText: {
    fontSize: mvs(14),
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

export default CarDetailsCard;
