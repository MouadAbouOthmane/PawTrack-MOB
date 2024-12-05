import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import {navigationRef} from '../services/NavigationService';
import HomeDogScreen from '../screens/HomeDogScreen';
import DogCreateScreen from '../screens/DogCreateScreen';
import DogDetailScreen from '../screens/DogDetailScreen';
import ActionSelectionScreen from '../screens/ActionSelectionScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen name="DogCreate" component={DogCreateScreen} />
        <Stack.Screen name="HomeDog" component={HomeDogScreen} />
        <Stack.Screen
          name="DogDetail"
          component={DogDetailScreen}
          options={{title: 'Détails du chien'}}
        />
        <Stack.Screen
          name="ActionSelection"
          component={ActionSelectionScreen}
          options={{title: 'Sélectionner une action'}}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
