import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Button, TextInput, List, useTheme} from 'react-native-paper';
import {useDogTracking} from '../hooks/DogTrackingContext';
import {useGeolocation} from '../features/infractions/hooks/useGeolocation';
import {getLocationDetails} from '../utils/location';
import Toast from 'react-native-toast-message';

const actions = [
  {
    id: 1,
    title: 'Castration / Stérilisation',
    icon: 'medical-bag',
  },
  {id: 2, title: 'Déparasitage', icon: 'bug'},
  {id: 3, title: 'Vaccination', icon: 'needle'},
  {id: 4, title: 'Examen général', icon: 'stethoscope'},
  {id: 5, title: 'Traitement', icon: 'pill'},
];

const ActionSelectionScreen = ({route, navigation}) => {
  const {addHistory, addEvent} = useDogTracking();

  const {dogId, willNotBeParent} = route.params;
  const [selectedAction, setSelectedAction] = useState(null);
  const [note, setNote] = useState('');
  const [isLoading, setLoading] = useState(false);
  const {getCurrentLocation} = useGeolocation();

  const theme = useTheme();

  let events = actions;

  if (willNotBeParent) {
    events = events.filter(event => event.id !== 1);
  }

  const handleActionSelect = action => {
    setSelectedAction(action);
  };

  const handleSubmit = async () => {
    // Here you would typically save the action and note to your backend or state management
    if (isLoading) {
      return;
    }
    setLoading(true);
    try {
      const currentLocation = await getCurrentLocation();

      // const address = await getLocationDetails(
      //   currentLocation.latitude,
      //   currentLocation.longitude,
      // );

      await addEvent({
        dog_id: dogId,
        type: selectedAction.title,
        date: new Date().toISOString(),
        location: {
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
          address: "",
        },
        note: note,
      });
      await addHistory({
        dog_id: dogId,
        event_type: selectedAction.title,
        event_date: new Date().toISOString(),
        location: {
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
          address: '',
        },
        note: note,
      });

      // Navigate back to the dog detail screen
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: "Erreur lors de l'enregistrement de l'action",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.primary}]}>
        Sélectionner une action
      </Text>

      {events.map(action => (
        <List.Item
          key={action.id}
          title={action.title}
          left={props => <List.Icon {...props} icon={action.icon} />}
          onPress={() => handleActionSelect(action)}
          style={[
            styles.actionItem,
            selectedAction?.id === action.id && {
              backgroundColor: theme.colors.primaryContainer,
            },
          ]}
          titleStyle={
            selectedAction?.id === action.id
              ? {color: theme.colors.primary, fontWeight: 'bold'}
              : {}
          }
        />
      ))}

      <TextInput
        label="Note"
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={4}
        style={styles.noteInput}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!selectedAction || isLoading}
        loading={isLoading}
        style={styles.submitButton}>
        {isLoading ? 'Chargement...' : "Enregistrer l'action"}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionItem: {
    marginBottom: 8,
    borderRadius: 8,
  },
  noteInput: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 16,
  },
});

export default ActionSelectionScreen;
