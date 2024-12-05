import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, useTheme} from 'react-native-paper';

const LocationButton = ({onPress, isLocating, location}) => {
  const theme = useTheme();

  const getButtonLabel = () => {
    if (isLocating) return 'Localisation en cours...';
    if (location.latitude) {
      return `Localisation : ${location.latitude.toFixed(
        4,
      )}, ${location.longitude.toFixed(4)} (${
        location.address || 'Adresse inconnue'
      })`;
    }
    return 'Obtenir la localisation actuelle';
  };

  return (
    <Button
      mode="outlined"
    //   onPress={ }
      disabled={isLocating}
      style={styles.button}
      icon="map-marker">
      {getButtonLabel()}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 16,
  },
});

export default LocationButton;
