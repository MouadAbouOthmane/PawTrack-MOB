import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Title, Button, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';
import Header from '../components/Header';
import {logout} from '../redux/slices/agentSlice';
import {useDispatch, useSelector} from 'react-redux';
import {logoutAndReset} from '../services/NavigationService';

const ActionButton = ({title, icon, onPress, color}) => {
  const theme = useTheme();
  return (
    <Button
      mode="contained"
      icon={({size}) => (
        <Icon name={icon} size={size} color={theme.colors.surface} />
      )}
      onPress={onPress}
      style={[styles.actionButton, {backgroundColor: color}]}
      labelStyle={{color: theme.colors.surface}}>
      {title}
    </Button>
  );
};

export default function Dashboard() {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.agent.info);
  const actions = [
    {
      title: 'Créer une infraction',
      icon: 'plus',
      onPress: () => navigation.navigate('CreateInfraction'),
      color: theme.colors.primary,
    },
    {
      title: 'Rechercher',
      icon: 'magnify',
      onPress: () => navigation.navigate('SearchInfraction'),
      color: theme.colors.primary,
    },
    {
      title: 'Paramètres Bluetooth',
      icon: 'bluetooth-settings',
      onPress: () => navigation.navigate('Settings'),
      color: theme.colors.secondary,
    },
    {
      title: 'Déconnexion',
      icon: 'logout',
      onPress: () => signOut(),
      color: theme.colors.error,
    },
  ];

  if (user?.role === 'Caissier') {
    actions.shift();
  }
  const signOut = () => {
    dispatch(logout());
    logoutAndReset();
  };
  return (
    <>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Header
          title="Accueil"
          onSettingsPress={() => navigation.navigate('Settings')}
        />
        <Title
          style={[styles.sectionTitle, {color: theme.colors.inverseSurface}]}>
          Bonjour, {user?.full_name}!
        </Title>
        <Title style={[styles.sectionTitle, {color: theme.colors.primary}]}>
          Actions rapides
        </Title>
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              title={action.title}
              icon={action.icon}
              onPress={action.onPress}
              color={action.color}
            />
          ))}
        </View>
      </ScrollView>
      <BottomNavBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSurface: {
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  statCard: {
    width: '45%',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  timeframeCard: {
    width: '45%',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  timeframeStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  divider: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  actionButton: {
    width: '45%',
    marginBottom: 15,
    borderRadius: 8,
  },
});
