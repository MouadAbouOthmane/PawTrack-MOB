// LoadingScreen.js
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

const LoadingComponent = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // You can change this to your desired background color
  },
});

export default LoadingComponent;
