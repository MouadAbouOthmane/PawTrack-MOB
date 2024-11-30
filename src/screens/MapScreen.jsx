import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

export default function MapScreen({navigation}) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Header
        title="Home"
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <View style={styles.content}>
        <Text>Bienvenue sur l'écran de la carte !</Text>
      </View>
      <BottomNavBar
        onHomePress={() => navigation.navigate('Home')}
        onInfractionPress={() => navigation.navigate('Infractions')}
        onMapPress={() => navigation.navigate('Map')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
