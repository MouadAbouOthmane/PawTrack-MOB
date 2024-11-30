import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Text} from 'react-native-paper';
import {useCreateInfraction} from '../CreateInfractionContext';

export default function StepTwo() {
  const {formData, handleInputChange, errors} = useCreateInfraction();

  return (
    <View>
      <Text style={styles.stepTitle}>Informations sur le véhicule</Text>
      <TextInput
        label="Matricule"
        value={formData.matricule}
        onChangeText={text => handleInputChange('matricule', text)}
        style={styles.input}
        error={!!errors.matricule}
      />
      {errors.matricule && (
        <Text style={styles.errorText}>{errors.matricule}</Text>
      )}
      <TextInput
        label="Propriétaire (facultatif)"
        value={formData.owner}
        onChangeText={text => handleInputChange('owner', text)}
        style={styles.input}
      />
      <TextInput
        label="Marque (facultatif)"
        value={formData.brand}
        onChangeText={text => handleInputChange('brand', text)}
        style={styles.input}
      />
      <TextInput
        label="Modèle (facultatif)"
        value={formData.model}
        onChangeText={text => handleInputChange('model', text)}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});
