import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput, useTheme} from 'react-native-paper';

const AgeInput = ({value, onChangeText}) => {
  const theme = useTheme();

  return (
    <TextInput
      style={[styles.input, {backgroundColor: theme.colors.surface}]}
      label="Âge"
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
      mode="outlined"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
});

export default AgeInput;
