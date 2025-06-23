import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const ServiceAdjustFilterSheet = ({ filters, setFilters, closeSheet }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
      {[
        { label: 'Education Required', key: 'educationRequired', placeholder: 'e.g. Bachelor' },
        { label: 'Experience Required', key: 'experienceRequired', placeholder: 'e.g. 2 Years' },
        { label: 'Gender Preference', key: 'genderPreference', placeholder: 'e.g. Any' },
        { label: 'Requirements / Qualifications', key: 'requirements_Qualifications', placeholder: 'e.g. Certified Electrician' },
        { label: 'Skills', key: 'skills', placeholder: 'e.g. Cleaning, Electrical' },
        { label: 'Work Timing', key: 'workTiming', placeholder: 'e.g. 9-5' },
        { label: 'Contract Duration', key: 'contractDuration', placeholder: 'e.g. 6 Months' },
        { label: 'Benefits', key: 'benefits', placeholder: 'e.g. Health Insurance' },
        { label: 'Number of Vacancies', key: 'numberofVacancies', placeholder: 'e.g. 2' },
        { label: 'Application Deadline', key: 'applicationDeadline', placeholder: 'e.g. 2025-07-15' },
        { label: 'Contact Method', key: 'contactMethod', placeholder: 'e.g. Phone, Email' },
        { label: 'Salary Type', key: 'salaryType', placeholder: 'e.g. Hourly' },
        { label: 'Employment Type', key: 'employmentType', placeholder: 'e.g. Full-time' },
        { label: 'Job Location', key: 'jobLocation', placeholder: 'e.g. Rawalpindi' },
      ].map(({ label, key, placeholder }) => (
        <View key={key} style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>{label}</Text>
          <TextInput
            placeholder={placeholder}
            style={inputStyle}
            value={filters[key]}
            onChangeText={text => setFilters(prev => ({ ...prev, [key]: text }))}
          />
        </View>
      ))}
    </BottomSheetScrollView>
  );
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
};

export default ServiceAdjustFilterSheet;
