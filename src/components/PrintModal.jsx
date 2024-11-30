import React from 'react';
import {Button} from 'react-native-paper';
import {StyleSheet, Text, View, Modal} from 'react-native';

export default function PrintModal({visible, onConfirm}) {
  return (
    // <Portal><Text>dddd</Text>
    <Modal
      transparent={true}
      visible={visible} // Use the visible prop to control the modal
      onRequestClose={() => {}}
      animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Infraction payée avec succès.</Text>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.modalButton}
            labelStyle={styles.modalButtonLabel}>
            Imprimer le reçu de paiement
          </Button>
        </View>
      </View>
    </Modal>
    // </Portal>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
