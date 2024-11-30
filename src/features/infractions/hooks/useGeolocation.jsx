import {useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {goBack, navigate} from '../../../services/NavigationService';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestAndroidPermission = async () => {
    try {
      // Check if fine location permission is granted
      const fineLocationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      // If not granted, request it
      if (!fineLocationGranted) {
        const requestFineLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message:
              "Cette application a besoin d'accéder à votre localisation pour enregistrer l'endroit où l'infraction a eu lieu.",
            buttonNeutral: 'Demandez-moi plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: "D'accord",
          },
        );

        if (requestFineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission refusée',
            'La permission de localisation précise est requise pour utiliser cette fonctionnalité.',
          );
          return false; // Permission denied
        }
      }

      // Check if location services are enabled
      const locationEnabled = await DeviceInfo.isLocationEnabled();
      if (!locationEnabled) {
        Alert.alert(
          'Activer les services de localisation',
          'Les services de localisation sont désactivés. Veuillez les activer pour continuer.',
        );
        return false;
      }

      // Check if coarse location permission is granted
      const coarseLocationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );

      // If not granted, request it
      if (!coarseLocationGranted) {
        const requestCoarseLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: 'Permission des services de localisation',
            message:
              "Cette application a besoin d'accéder à vos services de localisation pour enregistrer l'endroit où l'infraction a eu lieu",
            buttonNeutral: 'Demandez-moi plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: "D'accord",
          },
        );

        if (requestCoarseLocation !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission refusée',
            "La permission d'accès à la localisation approximative est requise pour utiliser cette fonctionnalité.",
          );
          return false; // Permission denied
        }
      }

      // All permissions granted
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    console.log('Getting current location...');

    try {
      // Request permission on Android
      if (Platform.OS === 'android') {
        const hasPermission = await requestAndroidPermission();
        console.log('Permission granted?', hasPermission);
        if (!hasPermission) {
          goBack();
          throw new Error('Location permission denied');
        }
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          info => resolve(info),
          error => reject(error),
          {
            enableHighAccuracy: false,
            timeout: 30000, // longer timeout
            maximumAge: 60000,
          },
        );
      });

      console.log('Position obtained:', position);

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (err) {
      console.error('Error getting location:', err.message); // More specific logging
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    error,
    loading,
    getCurrentLocation,
  };
};
