import {createContext, useContext, useState, useCallback} from 'react';
import {useGeolocation} from '../../hooks/useGeolocation';
import {Alert} from 'react-native';
import {navigate} from '../../../../services/NavigationService';

const CreateInfractionContext = createContext();

const INITIAL_FORM_STATE = {
  id_type_infraction: '',
  description: '',
  amount: '',
  matricule: '',
  owner: '',
  brand: '',
  model: '',
  photos: [],
  latitude: null,
  longitude: null,
};

export function CreateInfractionProvider({children}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const {getCurrentLocation} = useGeolocation();

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setStep(1);
  };

  const initializeLocation = async () => {
    // Geolocation.getCurrentPosition(info => console.log(info));
    try {
      const location = await getCurrentLocation();
      console.log(
        '|CreateInfractionContext|initializeLocation|location|',
        location,
      );
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      return true;
    } catch (error) {
      Alert.alert(
        'Erreur de localisation.',
        'Impossible de déterminer votre emplacement.',
        [{text: 'OK'}],
      );
      navigate('Infractions');

      return false;
    }
  };

  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
    setErrors(prev => ({...prev, [name]: ''}));
  }, []);

  const validateStep = useCallback(() => {
    const stepValidations = {
      1: () => {
        const stepErrors = {};
        if (!formData.id_type_infraction) {
          stepErrors.id_type_infraction = "Sélectionnez un type d'infraction";
        }
        if (!formData.amount) {
          stepErrors.amount = 'Le montant est requis.';
        }
        return stepErrors;
      },
      2: () => {
        const stepErrors = {};
        if (!formData.matricule) {
          stepErrors.matricule = 'Le matricule est requis.';
        }
        return stepErrors;
      },
      3: () => ({}),
    };

    const newErrors = stepValidations[step]();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData]);

  const value = {
    step,
    setStep,
    formData,
    setFormData,
    errors,
    setErrors,
    handleInputChange,
    validateStep,
    initializeLocation,
    resetForm,
  };

  return (
    <CreateInfractionContext.Provider value={value}>
      {children}
    </CreateInfractionContext.Provider>
  );
}

export const useCreateInfraction = () => {
  const context = useContext(CreateInfractionContext);
  if (!context) {
    throw new Error(
      'useCreateInfraction must be used within a CreateInfractionProvider',
    );
  }
  return context;
};
