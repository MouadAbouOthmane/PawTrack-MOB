import React from 'react';
import {StyleSheet} from 'react-native';
import {ProgressBar, useTheme} from 'react-native-paper';
import {useCreateInfraction} from './CreateInfractionContext';

export default function FormProgress() {
  const {step} = useCreateInfraction();
  const theme = useTheme();

  return (
    <ProgressBar
      progress={step / 3}
      color={theme.colors.primary}
      style={styles.progressBar}
    />
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: 8,
  },
});
