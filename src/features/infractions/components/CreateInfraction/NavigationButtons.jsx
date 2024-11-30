import React from 'react';
import {View, StyleSheet, Modal, Text, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import {useCreateInfraction} from './CreateInfractionContext';
import {useInfractionSubmit} from '../../hooks/useInfractionSubmit';
import useInfractionTicketPrinter from '../../hooks/useInfractionTicketPrinter1';
import useArabicInfractionTicketPrinter from '../../hooks/useArabicInfractionTicketPrinter';

export default function NavigationButtons() {
  const {step, setStep, validateStep} = useCreateInfraction();
  const {
    submitInfraction,
    isSubmitting,
    submittedInfraction,
    isModalVisible,
    handlePrintAndNavigate,
  } = useInfractionSubmit();

  const {printInfractionTicket} = useInfractionTicketPrinter();
  const {printInfractionTicketAr, textImageComponent} =
    useArabicInfractionTicketPrinter();

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        await submitInfraction();
      } catch (error) {
        Alert.alert(
          'Erreur',
          'Une erreur est survenue lors de la soumission.',
          [{text: 'OK'}],
        );
      }
    }
  };

  const printInfraction = async () => {
    try {
      await printInfractionTicket(submittedInfraction);
      // await printInfractionTicketAr(submittedInfraction);
      handlePrintAndNavigate();
    } catch (error) {
      Alert.alert('Erreur', "Erreur lors de l'impression du billet.", [
        {text: 'OK'},
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <Button
            mode="outlined"
            onPress={handleBack}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={isSubmitting}>
            Retour
          </Button>
        )}
        {step < 3 ? (
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
            labelStyle={styles.buttonLabel}>
            Suivant
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
            labelStyle={styles.buttonLabel}>
            Soumettre
          </Button>
        )}
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {}}
        animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Infraction créée avec succès.</Text>
            <Button
              mode="contained"
              onPress={printInfraction}
              style={styles.modalButton}
              labelStyle={styles.modalButtonLabel}>
              Imprimer l'infraction
            </Button>
          </View>
        </View>
      </Modal>
      {/* {textImageComponent && (
        <View style={{position: 'absolute', opacity: 0}}>
          {textImageComponent}
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonLabel: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    width: '100%',
  },
  modalButtonLabel: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
