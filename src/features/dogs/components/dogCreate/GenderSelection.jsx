import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, RadioButton, useTheme} from 'react-native-paper';

const GenderSelection = ({value, onValueChange}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: theme.colors.text}]}>Sexe :</Text>
      <RadioButton.Group onValueChange={onValueChange} value={value}>
        <View style={styles.radioRow}>
          <RadioButton.Item label="Mâle" value="male" />
          <RadioButton.Item label="Femelle" value="female" />
        </View>
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default GenderSelection;
