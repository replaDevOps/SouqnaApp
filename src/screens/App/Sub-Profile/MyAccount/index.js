import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyAccount = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Account Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MyAccount;


// import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import React, { useState } from 'react';
// import Header from '../components/Header';
// import * as Icon from 'react-native-feather';
// import theme from '../../constants/theme';

// export default function MyAccount() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [originalData, setOriginalData] = useState({
//     name: 'Bibhushan Saakha',
//     occupation: 'Student',
//     address: 'Koteshwor,Kathmandu',
//     phone: '+92*********',
//     email: 'email@example.com',
//     isMember: true
//   });
//   const [editedData, setEditedData] = useState(originalData);

//   const handleEditToggle = () => {
//     if (isEditing) {
//       setOriginalData(editedData);
//     } else {
//       setEditedData(originalData);
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleCancel = () => {
//     setEditedData(originalData);
//     setIsEditing(false);
//   };

//   const handleChange = (field, value) => {
//     setEditedData(prev => ({ ...prev, [field]: value }));
//   };

//   const toggleMember = () => {
//     setEditedData(prev => ({ ...prev, isMember: !prev.isMember }));
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{ flex: 1 }}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
//     >
//       <View className='flex-1'>
//         <Header />

//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           <View>
//             {/* Profile Image */}
//             <View className='my-20 items-center'>
//               <View className='bg-green-200 rounded-full w-36 h-36 justify-center overflow-visible items-center'>
//                 <Image 
//                   className='w-28 h-28 rounded-full' 
//                   source={require('../../assets/Images/profile-Img.jpg')}
//                 />
//               </View>
//             </View>

//             {/* Personal info */}
//             <View className='bg-white mx-6 rounded-lg p-4'>
//               <Text className='font-bold text-xl mb-5'>Personal Info</Text>
              
//               <View className='flex-row py-2 px-2 justify-between items-center'>
//                 <Text>Your name</Text>
//                 {isEditing ? (
//                   <TextInput
//                     className='text-lg border-b border-gray-200 px-2 flex-1 ml-4'
//                     value={editedData.name}
//                     onChangeText={(text) => handleChange('name', text)}
//                   />
//                 ) : (
//                   <Text className='text-lg'>{editedData.name}</Text>
//                 )}
//               </View>
              
//               <View className='flex-row py-2 px-2 justify-between items-center'>
//                 <Text>Occupation</Text>
//                 {isEditing ? (
//                   <TextInput
//                     className='text-lg border-b border-gray-200 px-2 flex-1 ml-4'
//                     value={editedData.occupation}
//                     onChangeText={(text) => handleChange('occupation', text)}
//                   />
//                 ) : (
//                   <Text className='text-lg'>{editedData.occupation}</Text>
//                 )}
//               </View>
              
//               <View className='flex-row py-2 px-2 justify-between items-center'>
//                 <Text>Address</Text>
//                 {isEditing ? (
//                   <TextInput
//                     className='text-lg border-b border-gray-200 px-2 flex-1 ml-4'
//                     value={editedData.address}
//                     onChangeText={(text) => handleChange('address', text)}
//                   />
//                 ) : (
//                   <Text className='text-lg'>{editedData.address}</Text>
//                 )}
//               </View>
              
//               <View className='flex-row py-2 px-2 justify-between items-center'>
//                 <Text>Member</Text>
//                 <TouchableOpacity onPress={isEditing ? toggleMember : undefined}>
//                   {editedData.isMember ? 
//                     <Icon.ToggleLeft width={50} height={50} stroke={'white'} fill={'green'} />
//                     :
//                     <Icon.ToggleRight width={50} height={50} stroke={'white'} fill={'green'} />
//                   }
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Contact info */}
//             <View className='bg-white mx-6 rounded-lg mt-4 mb-6 p-4'>
//               <Text className='font-bold text-xl mb-5'>Contact Info</Text>
              
//               <View className='flex-row py-2 px-2 justify-between items-center'>
//                 <Text>Phone number</Text>
//                 {isEditing ? (
//                   <TextInput
//                     className='text-lg border-b border-gray-200 px-2 flex-1 ml-4'
//                     value={editedData.phone}
//                     onChangeText={(text) => handleChange('phone', text)}
//                     keyboardType='phone-pad'
//                   />
//                 ) : (
//                   <Text className='text-lg'>{editedData.phone}</Text>
//                 )}
//               </View>
              
//               <View className='flex-row py-2 px-2 justify-between items-center'>
//                 <Text>Email</Text>
//                 {isEditing ? (
//                   <TextInput
//                     className='text-lg border-b border-gray-200 px-2 flex-1 ml-4'
//                     value={editedData.email}
//                     onChangeText={(text) => handleChange('email', text)}
//                     keyboardType='email-address'
//                   />
//                 ) : (
//                   <Text className='text-lg'>{editedData.email}</Text>
//                 )}
//               </View>
//             </View>
//           </View>

//           <View className='items-center'>
//             {/* Save/Cancel buttons */}
//             <View className='flex-row justify-between mx-6 py-4 rounded-lg mt-6'>
//               {isEditing ? (
//                 <>
//                   <TouchableOpacity 
//                     className='py-2 px-6 rounded-lg bg-gray-300'
//                     onPress={handleCancel}
//                   >
//                     <Text className='text-center text-lg text-gray-700'>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity 
//                     className='py-2 px-6 rounded-lg bg-green-500'
//                     onPress={handleEditToggle}
//                   >
//                     <Text className='text-center text-lg text-white'>Save</Text>
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <TouchableOpacity 
//                   className='mx-6 py-4 rounded-lg mt-4 w-96'
//                   style={{ backgroundColor: theme.colors.primary }}
//                   onPress={handleEditToggle}
//                 >
//                   <Text className='text-center font-semibold text-xl text-white'>
//                     Edit Profile
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
