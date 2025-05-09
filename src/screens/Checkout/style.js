import { StyleSheet } from "react-native";
import { colors } from "../../util/color";

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
      flexGrow: 1,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      alignSelf: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
    },
    dropdown: {
      borderColor: '#ccc',
      marginBottom: 20,
      borderRadius: 8,
    },
    dropdownContainer: {
      borderColor: '#ccc',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    button: {
      backgroundColor: colors.green,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    closeButton: {
      position: 'absolute',
      right: 15,
      top: 15,
      zIndex: 10,
    },
  });
  export default styles