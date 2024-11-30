import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {setDefaultPrinterAddress} from '../redux/slices/settingsSlice';

const BluetoothScreen = () => {
  const dispatch = useDispatch();
  const defaultPrinter = useSelector(state => state.settings.defaultPrinter);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestBluetoothPermission();
    scanDevices();
  }, []);

  const requestBluetoothPermission = async () => {
    // Request Bluetooth permissions
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const isAllGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );

        // if (!isAllGranted) {
        //   Alert.alert('Error', 'Bluetooth permissions are required.');
        // }
      } catch (err) {
        console.error('Error requesting Bluetooth permissions:', err);
      }
    }
  };

  const scanDevices = async () => {
    setLoading(true);
    try {
      // Scan for paired Bluetooth devices
      const devices = await BluetoothManager.scanDevices();
      const paired = JSON.parse(devices).paired || [];
      const found = JSON.parse(devices).found || [];

      setPairedDevices(paired.concat(found));
      console.log(JSON.parse(devices));
      // setPairedDevices(paired);
    } catch (error) {
      console.error('Error scanning Bluetooth devices:', error);
      Alert.alert('Error', 'Échec du scan des appareils Bluetooth.');
    } finally {
      setLoading(false);
    }
  };

  const connectPrinter = async (address, name) => {
    try {
      // Connect to the selected Bluetooth printer
      await BluetoothManager.connect(address);
      dispatch(setDefaultPrinterAddress({address: address, name: name}));
      defaultPrinter.is_connect = true;
      Alert.alert('Success', 'Imprimante connectée avec succès.');
    } catch (error) {
      console.error('Error connecting printer:', error);
      Alert.alert('Error', "Échec de la connexion de l'imprimante.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Paramètres de l'imprimante Bluetooth
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={scanDevices}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Scan en cours...' : 'Scanner les imprimantes Bluetooth'}
        </Text>
      </TouchableOpacity>

      <View style={styles.devicesContainer}>
        {defaultPrinter.address ? (
          <>
            <Text style={styles.sectionTitle}>Imprimante sélectionnée</Text>
            <View style={styles.deviceItem}>
              <Text style={styles.boldText}>Nom : {defaultPrinter.name}</Text>
              <Text style={styles.printerAddress}>
                Adresse : {defaultPrinter.address}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.sectionTitle}>
            Aucune imprimante sélectionnée.
          </Text>
        )}
        <Text style={styles.sectionTitle}>
          Appareils disponibles ({pairedDevices.length})
        </Text>
        <ScrollView>
          {pairedDevices.map((device, index) => (
            <TouchableOpacity
              key={device.address || index}
              style={styles.deviceItem}
              onPress={() => connectPrinter(device.address, device.name)}>
              <Text style={styles.deviceName}>
                {device.name || 'Appareil Inconnu'}
              </Text>
              <Text style={styles.deviceAddress}>{device.address}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesContainer: {
    flex: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deviceItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 5,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default BluetoothScreen;
