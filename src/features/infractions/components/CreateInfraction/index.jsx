import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, Alert} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {CreateInfractionProvider} from './CreateInfractionContext';
import InfractionForm from './InfractionForm';
import {useCreateInfraction} from './CreateInfractionContext';
import {useSelector} from 'react-redux';
import {goBack} from '../../../../services/NavigationService';

function CreateInfractionContent() {
  const {initializeLocation} = useCreateInfraction();
  const [initializing, setInitializing] = useState(true);
  const defaultPrinter = useSelector(
    state => state.settings.defaultPrinter.address,
  );
  const theme = useTheme();

  useEffect(() => {
    if (!defaultPrinter) {
      Alert.alert(
        'Impression impossible',
        "Aucune imprimante par défaut n'est configurée",
      );
      goBack();
      return;
    }
    const initialize = async () => {
      await initializeLocation();
      setInitializing(false);
    };

    initialize();
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Obtention de la localisation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Créer une infraction" />
      </Appbar.Header>
      <InfractionForm />
    </View>
  );
}

export default function CreateInfractionScreen() {
  return (
    <CreateInfractionProvider>
      <CreateInfractionContent />
    </CreateInfractionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
