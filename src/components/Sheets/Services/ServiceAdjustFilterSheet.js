import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {resetButtonStyle} from '../../../util/Filtering/filterStyles';

const ServiceAdjustFilterSheet = ({filters, setFilters, closeSheet}) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [employmentOpen, setEmploymentOpen] = useState(false);

  const resetFilters = () => {
    setFilters({
      educationRequired: '',
      experienceRequired: '',
      genderPreference: '',
      requirements_Qualifications: '',
      skills: '',
      workTiming: '',
      contractDuration: '',
      benefits: '',
      numberofVacancies: '',
      applicationDeadline: '',
      contactMethod: '',
      salaryType: '',
      employmentType: '',
      jobLocation: '',
    });
  };

  const renderTextInput = (label, key, placeholder) => (
    <View key={key} style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        value={filters[key]}
        onChangeText={text => setFilters(prev => ({...prev, [key]: text}))}
      />
    </View>
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={{padding: 20, paddingBottom: 120}}>
      {renderTextInput(
        'Education Required',
        'educationRequired',
        'e.g. Bachelor',
      )}
      {renderTextInput(
        'Experience Required',
        'experienceRequired',
        'e.g. 2 Years',
      )}

      {/* Gender Preference Dropdown */}
      <View style={[styles.field, {zIndex: 3000}]}>
        <Text style={styles.label}>Gender Preference</Text>
        <DropDownPicker
          open={genderOpen}
          setOpen={open => {
            setGenderOpen(open);
            if (open) {
              setContactOpen(false);
              setSalaryOpen(false);
              setEmploymentOpen(false);
            }
          }}
          value={filters.genderPreference}
          setValue={val =>
            setFilters(prev => ({...prev, genderPreference: val()}))
          }
          items={[
            {label: 'Any', value: 'Any'},
            {label: 'Male', value: 'Male'},
            {label: 'Female', value: 'Female'},
          ]}
          placeholder="Select"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {renderTextInput(
        'Requirements / Qualifications',
        'requirements_Qualifications',
        'e.g. Certified Electrician',
      )}
      {renderTextInput('Skills', 'skills', 'e.g. Cleaning, Electrical')}
      {renderTextInput('Work Timing', 'workTiming', 'e.g. 9-5')}
      {renderTextInput(
        'Contract Duration',
        'contractDuration',
        'e.g. 6 Months',
      )}
      {renderTextInput('Benefits', 'benefits', 'e.g. Health Insurance')}
      {renderTextInput('Number of Vacancies', 'numberofVacancies', 'e.g. 2')}
      {renderTextInput(
        'Application Deadline',
        'applicationDeadline',
        'e.g. 2025-07-15',
      )}

      {/* Contact Method Dropdown */}
      <View style={[styles.field, {zIndex: 3000, elevation: 3}]}>
        <Text style={styles.label}>Contact Method</Text>
        <DropDownPicker
          open={contactOpen}
          setOpen={open => {
            setContactOpen(open);
            if (open) {
              setGenderOpen(false);
              setSalaryOpen(false);
              setEmploymentOpen(false);
            }
          }}
          value={filters.contactMethod}
          setValue={val =>
            setFilters(prev => ({...prev, contactMethod: val()}))
          }
          items={[
            {label: 'Phone', value: 'Phone'},
            {label: 'Email', value: 'Email'},
            {label: 'Walk-in', value: 'Walk-in'},
          ]}
          placeholder="Select"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {/* Salary Type Dropdown */}
      <View style={[styles.field, {zIndex: 2000, elevation: 2}]}>
        <Text style={styles.label}>Salary Type</Text>
        <DropDownPicker
          open={salaryOpen}
          setOpen={open => {
            setSalaryOpen(open);
            if (open) {
              setGenderOpen(false);
              setContactOpen(false);
              setEmploymentOpen(false);
            }
          }}
          value={filters.salaryType}
          setValue={val => setFilters(prev => ({...prev, salaryType: val()}))}
          items={[
            {label: 'Hourly', value: 'Hourly'},
            {label: 'Monthly', value: 'Monthly'},
            {label: 'Project-based', value: 'Project-based'},
            {label: 'Negotiable', value: 'Negotiable'},
          ]}
          placeholder="Select"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {/* Employment Type Dropdown */}
      <View style={[styles.field, {zIndex: 1000, elevation: 1}]}>
        <Text style={styles.label}>Employment Type</Text>
        <DropDownPicker
          open={employmentOpen}
          setOpen={open => {
            setEmploymentOpen(open);
            if (open) {
              setGenderOpen(false);
              setContactOpen(false);
              setSalaryOpen(false);
            }
          }}
          value={filters.employmentType}
          setValue={val =>
            setFilters(prev => ({...prev, employmentType: val()}))
          }
          items={[
            {label: 'Full-time', value: 'Full-time'},
            {label: 'Part-time', value: 'Part-time'},
            {label: 'Contract', value: 'Contract'},
            {label: 'Temporary', value: 'Temporary'},
          ]}
          placeholder="Select"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {renderTextInput('Job Location', 'jobLocation', 'e.g. Rawalpindi')}

      {/* --- RESET FILTERS BUTTON --- */}
      <TouchableOpacity onPress={resetFilters} style={resetButtonStyle}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>Reset Filters</Text>
      </TouchableOpacity>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    zIndex: 9999,
  },
});

export default ServiceAdjustFilterSheet;
