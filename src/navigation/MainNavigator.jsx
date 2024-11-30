import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import {navigationRef} from '../services/NavigationService';
import CreateInfractionScreen from '../features/infractions/components/CreateInfraction';
import InfractionDetail from '../features/infractions/components/InfractionDetail';
import Infractions from '../screens/Infractions';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import TestScreen from '../screens/TestScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import SearchInfractionScreen from '../screens/SearchInfractionScreen';
import Dashboard from '../screens/DashboardScreen';
import HomeDogScreen from '../screens/HomeDogScreen';

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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Dashboard} />
        <Stack.Screen name="HomeDog" component={HomeDogScreen} />
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen name="Map" component={TestScreen} />
        {/* <Stack.Screen name="Map" component={MapScreen} /> */}
        <Stack.Screen name="Settings" component={BluetoothScreen} />
        <Stack.Screen
          name="SearchInfraction"
          component={SearchInfractionScreen}
        />

        <Stack.Screen name="Infractions" component={Infractions} />
        <Stack.Screen
          name="CreateInfraction"
          component={CreateInfractionScreen}
        />
        <Stack.Screen name="InfractionDetail" component={InfractionDetail} />
        {/* Add other screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
