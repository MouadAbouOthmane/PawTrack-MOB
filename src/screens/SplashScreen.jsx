import React, {useEffect} from 'react';
import {
  View,
  Platform,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {VERSION} from '../../afterWillbeEnv';


const SplashScreen = ({navigation}) => {
  async function requestBluetoothAndLocationAndCameraAndStoragePermissions() {
    if (Platform.Version >= 31) {
      // Android 12+
      const bluetoothConnectStatus = await check(
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      );
      if (bluetoothConnectStatus === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission bloquée',
          "La permission de connexion Bluetooth est bloquée. Veuillez l'activer dans les paramètres de l'application.",
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => openSettings()},
          ],
        );
        return;
      } else if (bluetoothConnectStatus === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
        if (result !== RESULTS.GRANTED) {
          console.log('Bluetooth Connect permission denied');
        }
      }

      // Same for Bluetooth Scan
      const bluetoothScanStatus = await check(
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      );
      if (bluetoothScanStatus === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission bloquée',
          "La permission de scan Bluetooth est bloquée. Veuillez l'activer dans les paramètres de l'application.",
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => openSettings()},
          ],
        );
        return;
      } else if (bluetoothScanStatus === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
        if (result !== RESULTS.GRANTED) {
          console.log('Bluetooth Scan permission denied');
          return;
        }
      }
    }

    // Handle Location Permission similarly
    const locationPermissionStatus = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    if (locationPermissionStatus === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission bloquée',
        "La permission de localisation est bloquée. Veuillez l'activer dans les paramètres de l'application.",
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
      return;
    } else if (locationPermissionStatus === RESULTS.DENIED) {
      const locationResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (locationResult !== RESULTS.GRANTED) {
        console.log('Location permission denied');
        return;
      }
    }
    const locationPermissionStatus1 = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    if (locationPermissionStatus1 === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission bloquée',
        "La permission de localisation est bloquée. Veuillez l'activer dans les paramètres de l'application.",
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
      return;
    } else if (locationPermissionStatus1 === RESULTS.DENIED) {
      const locationResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (locationResult !== RESULTS.GRANTED) {
        console.log('Location permission denied');
        return;
      }
    }

    // Handle Camera Permission similarly
    const cameraPermissionStatus = await check(PERMISSIONS.ANDROID.CAMERA);
    if (cameraPermissionStatus === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission bloquée',
        "La permission de la caméra est bloquée. Veuillez l'activer dans les paramètres de l'application.",
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
      return;
    } else if (cameraPermissionStatus === RESULTS.DENIED) {
      const cameraResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (cameraResult !== RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }

    // Handle Storage Permission similarly
    const storagePermissionStatus = await check(
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );
    if (storagePermissionStatus === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission bloquée',
        "La permission de stockage est bloquée. Veuillez l'activer dans les paramètres de l'application.",
        [
          {text: 'Annuler', style: 'cancel'},
          {text: 'Ouvrir les paramètres', onPress: () => openSettings()},
        ],
      );
      return;
    } else if (storagePermissionStatus === RESULTS.DENIED) {
      const storageResult = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      if (storageResult !== RESULTS.GRANTED) {
        console.log('Storage permission denied');
        return;
      }
    }
  }
  useEffect(() => {
    const checkAgentSession = async () => {
      await requestBluetoothAndLocationAndCameraAndStoragePermissions();
      setTimeout(async () => {
        // If the token exists, navigate directly to the main app
        navigation.replace('HomeDog'); // Change to your main app screen
      }, 1000); // TODO: decrease timeout for production to be 1000
    };

    checkAgentSession();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/hh.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#d25c3d" style={{marginTop: 20}} />
      <Text style={styles.versionText}>{VERSION}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Change to your preferred background color
  },
  logo: {
    width: 350, // Adjust logo size as needed
    height: 200,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#000', // Change to your preferred text color
  },
  versionText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: '#9e3432', // Change to your preferred text color
  },
});

export default SplashScreen;
