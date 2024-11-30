import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default function MainScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text>MainScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
