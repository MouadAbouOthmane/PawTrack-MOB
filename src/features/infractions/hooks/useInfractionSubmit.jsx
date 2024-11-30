import {useState} from 'react';
import {useCreateInfraction} from '../components/CreateInfraction/CreateInfractionContext';
import {submitInfractionApi} from '../../../api/infractionRequest';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

export function useInfractionSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submittedInfraction, setSubmittedInfraction] = useState(null);

  const {formData, resetForm} = useCreateInfraction();
  const navigation = useNavigation();

  const submitInfraction = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Create FormData for image upload
      const formDataToSubmit = new FormData();

      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'photos') {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSubmit.append('photos[]', {
          uri: photo.uri,
          type: photo.type || 'image/jpeg', // Ensure the type is set correctly
          name: `photo${index}.jpg`,
        });
      });

      const response = await submitInfractionApi(formDataToSubmit);
      // Handle success
      setSubmittedInfraction(response.data);
      setIsModalVisible(true);
      // navigation.navigate('InfractionDetail', {
      //   message: 'Infraction créée avec succès.',
      //   id: response.data.id_infraction,
      // });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Erreur lors de la soumission de l'infraction.",
      );
      console.log('eerr', error);

      // Show error to user
      Alert.alert(
        'Error',
        "Échec de la soumission de l'infraction. Veuillez réessayer.",
        [{text: 'OK'}],
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintAndNavigate = () => {
    setIsModalVisible(false);
    resetForm();
    navigation.replace('InfractionDetail', {
      id: submittedInfraction.id_infraction,
    });
  };

  return {
    submitInfraction,
    isSubmitting,
    submitError,
    isModalVisible,
    submittedInfraction,
    handlePrintAndNavigate,
  };
}
