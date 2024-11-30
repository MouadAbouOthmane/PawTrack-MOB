import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  Chip,
  ProgressBar,
  Text,
  useTheme,
  Modal,
  Portal,
} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import {typeInfraction} from '../api/infractionRequest';

export default function CreateInfractionScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id_type_infraction: '',
    description: '',
    amount: '',
    matricule: '',
    owner: '',
    brand: '',
    model: '',
    photos: [],
  });
  const [infractionTypes, setInfractionTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false); // Modal visibility state
  const theme = useTheme();

  useEffect(() => {
    const getInfractionTypes = async () => {
      try {
        const res = await typeInfraction();
        setInfractionTypes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getInfractionTypes();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setErrors(prevErrors => ({...prevErrors, [name]: ''})); // Clear error on change
  };

  const handleTypeSelection = id => {
    const selectedType = infractionTypes.find(
      type => type.id_type_infraction === id,
    );
    handleInputChange('id_type_infraction', id);
    handleInputChange(
      'amount',
      selectedType ? selectedType.amount.toString() : '',
    );
  };

  const handleImagePick = () => {
    setVisible(true); // Open the modal
  };

  const launchCamera = () => {
    setVisible(false);
    ImagePicker.launchCamera(
      {mediaType: 'photo', includeBase64: false},
      response => {
        if (!response.didCancel && !response.error) {
          const sources = response.assets.map(asset => ({uri: asset.uri}));
          handleInputChange('photos', [...formData.photos, ...sources]);
        }
      },
    );
  };

  const launchImageLibrary = () => {
    setVisible(false);
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', includeBase64: false},
      response => {
        if (!response.didCancel && !response.error) {
          const sources = response.assets.map(asset => ({uri: asset.uri}));
          handleInputChange('photos', [...formData.photos, ...sources]);
        }
      },
    );
  };

  const validateStep = () => {
    let stepErrors = {};
    if (step === 1) {
      if (!formData.id_type_infraction)
        stepErrors.id_type_infraction = "Sélectionnez un type d'infraction";
      if (!formData.amount) stepErrors.amount = 'Le montant est requis.';
    } else if (step === 2) {
      if (!formData.matricule)
        stepErrors.matricule = 'Le matricule est requis.';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log('Form submitted:', formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>
              Sélectionner le type d'infraction.
            </Text>
            <View style={styles.chipContainer}>
              {infractionTypes.map(type => (
                <Chip
                  key={type.id}
                  selected={
                    formData.id_type_infraction === type.id_type_infraction
                  }
                  onPress={() => handleTypeSelection(type.id_type_infraction)}
                  style={styles.chip}>
                  {type.name}
                </Chip>
              ))}
            </View>
            {errors.id_type_infraction ? (
              <Text style={styles.errorText}>{errors.id_type_infraction}</Text>
            ) : null}
            <TextInput
              label="Montant"
              value={formData.amount}
              onChangeText={text => handleInputChange('amount', text)}
              keyboardType="numeric"
              disabled
              style={styles.input}
            />
            {errors.amount ? (
              <Text style={styles.errorText}>{errors.amount}</Text>
            ) : null}
            <TextInput
              label="Description (facultatif)"
              value={formData.description}
              onChangeText={text => handleInputChange('description', text)}
              multiline
              style={styles.input}
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Informations sur le véhicule</Text>
            <TextInput
              label="Matricule"
              value={formData.matricule}
              onChangeText={text => handleInputChange('matricule', text)}
              style={styles.input}
              required
            />
            {errors.matricule ? (
              <Text style={styles.errorText}>{errors.matricule}</Text>
            ) : null}
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
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Ajouter des photos</Text>
            <Button
              icon="camera"
              mode="contained"
              onPress={handleImagePick}
              style={styles.button}>
              Sélectionner des photos
            </Button>
            <View style={styles.photoContainer}>
              {formData.photos.map((photo, index) => (
                <Image key={index} source={photo} style={styles.photo} />
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Créer une infraction" />
      </Appbar.Header>
      <ProgressBar
        progress={step / 3}
        color={theme.colors.primary}
        style={styles.progressBar}
      />
      <ScrollView style={styles.scrollView}>{renderStep()}</ScrollView>
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <Button
            mode="outlined"
            onPress={() => setStep(step - 1)}
            style={styles.button}>
            Retour
          </Button>
        )}
        {step < 3 ? (
          <Button mode="contained" onPress={handleNext} style={styles.button}>
            Suivant
          </Button>
        ) : (
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Soumettre
          </Button>
        )}
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Sélectionner la source de l'image
          </Text>
          <Button
            mode="outlined"
            onPress={launchCamera}
            style={styles.modalButton}>
            Caméra{' '}
          </Button>
          <Button
            mode="outlined"
            onPress={launchImageLibrary}
            style={styles.modalButton}>
            Galerie
          </Button>
          <Button
            mode="text"
            onPress={() => setVisible(false)}
            style={styles.cancelButton}>
            Annuler
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
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
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 4,
  },
  progressBar: {
    height: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    elevation: 10, // Add elevation for shadow effect on Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center', // Center the title
  },
  modalButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 10,
  },
});
