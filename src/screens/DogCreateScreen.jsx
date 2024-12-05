import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {useGeolocation} from '../features/infractions/hooks/useGeolocation';
import {getLocationDetails} from '../utils/location';
import {useDogTracking} from '../hooks/DogTrackingContext';
import UHFTagInput from '../features/dogs/components/dogCreate/UHFTagInput';
import GenderSelection from '../features/dogs/components/dogCreate/GenderSelection';
import AgeInput from '../features/dogs/components/dogCreate/AgeInput';
import RaceSelection from '../features/dogs/components/dogCreate/RaceSelection';
import PhotoSection from '../features/dogs/components/dogCreate/PhotoSection';
import LocationButton from '../features/dogs/components/dogCreate/LocationButton';
import Toast from 'react-native-toast-message';

const DogCreateScreen = ({navigation}) => {
  const {addDog, addHistory} = useDogTracking();
  const {getCurrentLocation} = useGeolocation();
  const theme = useTheme();

  const [uhfTag, setUhfTag] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [race, setRace] = useState('');
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: '',
  });
  const [isLocating, setIsLocating] = useState(false);

  const getLocation = async () => {
    if (isLocating) return;
    console.log('getting location ... ');
    setIsLocating(true);
    try {
      const currentLocation = await getCurrentLocation();
      // const address = await getLocationDetails(
      //   currentLocation.latitude,
      //   currentLocation.longitude,
      // );
      setLocation({
        longitude: currentLocation.longitude,
        latitude: currentLocation.latitude,
        address: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'obtention de la localisation:", error);
      alert("Échec de l'obtention de la localisation");
      setLocation({longitude: null, latitude: null, address: ''});
    } finally {
      setIsLocating(false);
    }
  };

  const handleCreateDog = async () => {
    if (!uhfTag || !gender || !age || !race || photos.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const newDog = await addDog({
        uhf_tag: uhfTag,
        gender: gender,
        age: parseInt(age),
        race: race,
        photos: photos.map(p => p.uri),
        found_location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address || 'Localisation inconnue',
        },
      });

      await addHistory({
        dog_id: newDog.id,
        event_type: 'Trouvé',
        event_date: new Date().toISOString(),
        location: newDog.found_location,
        note: 'Chien ajouté',
      });

      Toast.show({type: 'success', text1: 'Chien créé avec succès !'});
      navigation.replace('DogDetail', {dogId: newDog.id});
      // Reset form fields
      setUhfTag('');
      setGender('');
      setAge('');
      setRace('');
      setPhotos([]);
      setLocation({latitude: null, longitude: null, address: ''});
    } catch (error) {
      console.error('Échec de la création du chien', error);
      alert('Échec de la création du chien');
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.primary}]}>
        Créer un profil de chien
      </Text>

      <UHFTagInput value={uhfTag} onChangeText={setUhfTag} />
      <GenderSelection value={gender} onValueChange={setGender} />
      <AgeInput value={age} onChangeText={setAge} />
      <RaceSelection value={race} onValueChange={setRace} />
      <PhotoSection
        photos={photos}
        setPhotos={setPhotos}
        onPress={getLocation}
      />
      {/* <LocationButton
        onPress={getLocation}
        isLocating={isLocating}
        location={location}
      /> */}

      <Button
        mode="contained"
        onPress={handleCreateDog}
        style={styles.createButton}
        labelStyle={styles.buttonLabel}>
        Créer un profil de chien
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DogCreateScreen;
