import React from 'react';
import {StyleSheet} from 'react-native';
import {Modal, Portal, Button, Text} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';

export default function ImagePickerModal({
  visible,
  onDismiss,
  onImageSelected,
}) {
  const launchCamera = async () => {
    const response = await ImagePicker.launchCamera({
      mediaType: 'photo',
      includeBase64: false,
    });
    handleImagePickerResponse(response);
  };

  const launchImageLibrary = async () => {
    const response = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });
    handleImagePickerResponse(response);
  };

  const handleImagePickerResponse = response => {
    if (!response.didCancel && !response.error && response.assets) {
      const sources = response.assets.map(asset => ({uri: asset.uri}));
      onImageSelected(sources);
    }
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Sélectionner la source de l'image</Text>
        <Button
          mode="outlined"
          onPress={launchCamera}
          style={styles.modalButton}>
          Caméra
        </Button>
        {/* <Button
          mode="outlined"
          onPress={launchImageLibrary}
          style={styles.modalButton}>
          Galerie
        </Button> */}
        <Button mode="text" onPress={onDismiss} style={styles.cancelButton}>
          Annuler
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 10,
  },
});
