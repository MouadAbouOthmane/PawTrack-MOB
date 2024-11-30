import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {getCurrentRoute, navigate} from '../services/NavigationService';

const BottomNavBar = () => {
  const theme = useTheme();

  const getButtonStyle = route => {
    const {name} = getCurrentRoute();
    return name === route ? styles.activeButton : styles.inactiveButton;
  };
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={[styles.bottomBarButton, getButtonStyle('Home')]}
        onPress={() => navigate('Home')}>
        <Icon name="home-outline" size={24} color={theme.colors.primary} />
        <Text style={{color: theme.colors.primary}}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.bottomBarButton, getButtonStyle('SearchInfraction')]}
        onPress={() => navigate('SearchInfraction')}>
        <Icon name="search-outline" size={24} color={theme.colors.primary} />
        <Text style={{color: theme.colors.primary}}>Rechercher</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.bottomBarButton, getButtonStyle('Infractions')]}
        onPress={() => navigate('Infractions')}>
        <Icon
          name="document-text-outline"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={{color: theme.colors.primary}}>Infractions</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.bottomBarButton}
        onPress={() => navigate('Map')}>
        <Icon name="map-outline" size={24} color={theme.colors.primary} />
        <Text style={{color: theme.colors.primary}}>Carte</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bottomBarButton: {
    alignItems: 'center',
    width: '25%',
  },
  activeButton: {
    backgroundColor: '#e2d0ff',
    borderRadius: 10,
    padding: 5,
  },
  inactiveButton: {
    backgroundColor: 'transparent',
    padding: 5,
  },
});

export default BottomNavBar;
