import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const CustomToast = ({ text1, text2, onPress }) => (
  <View style={styles.toastContainer}>
    <Text style={styles.title}>{text1}</Text>
    {text2 ? <Text style={styles.message}>{text2}</Text> : null}
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Aller à la connexion</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  toastContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FF5733', // Customize as needed
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CustomToast;
