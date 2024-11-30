import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {useCreateInfraction} from './CreateInfractionContext';

export default function LocationInfo() {
  const {formData} = useCreateInfraction();

  if (!formData.latitude || !formData.longitude) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Information</Text>
      <Text>Latitude: {formData.latitude.toFixed(6)}</Text>
      <Text>Longitude: {formData.longitude.toFixed(6)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
