import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useCreateInfraction} from './CreateInfractionContext';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import NavigationButtons from './NavigationButtons';
import FormProgress from './FormProgress';

export default function InfractionForm() {
  const {step} = useCreateInfraction();

  const renderStep = () => {
    const steps = {
      1: <StepOne />,
      2: <StepTwo />,
      3: <StepThree />,
    };
    return steps[step] || null;
  };

  return (
    <>
      <FormProgress />
      <ScrollView style={styles.scrollView}>{renderStep()}</ScrollView>
      <NavigationButtons />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
});
