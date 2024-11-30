import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useCreateInfraction} from '../CreateInfractionContext';
import ImagePickerModal from '../ImagePickerModal';

export default function StepThree() {
  const {formData, handleInputChange} = useCreateInfraction();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleImageSelected = newPhotos => {
    handleInputChange('photos', [...formData.photos, ...newPhotos]);
  };

  const handleRemovePhoto = index => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    handleInputChange('photos', updatedPhotos);
  };

  return (
    <View>
      <Text style={styles.stepTitle}>Ajouter des photos</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => setIsModalVisible(true)}
        style={styles.button}>
        Sélectionner des photos{' '}
      </Button>
      <View style={styles.photoContainer}>
        {formData.photos.map((photo, index) => (
          <View key={index} style={styles.photoWrapper}>
            <Image source={photo} style={styles.photo} />
            <Button
              icon="close"
              mode="text"
              onPress={() => handleRemovePhoto(index)}
              style={styles.removeButton}>
              Retirer
            </Button>
          </View>
        ))}
      </View>
      <ImagePickerModal
        visible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        onImageSelected={handleImageSelected}
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
  button: {
    marginBottom: 16,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  photoWrapper: {
    margin: 4,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
});
