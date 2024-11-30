// First install the library:
// npm install react-native-bluetooth-escpos-printer

// TestScreen.js
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from 'react-native-bluetooth-escpos-printer';

import ArabicText from '../assets/images/logo.png';

const TestScreen = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestBluetoothPermission();
  }, []);

  const requestBluetoothPermission = async () => {
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

        if (isAllGranted) {
          console.log('All permissions granted');
        } else {
          console.log('Some permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const scanDevices = async () => {
    setLoading(true);
    try {
      // Enable Bluetooth and ensure Bluetooth state is ready for scanning
      const enabled = await BluetoothManager.enableBluetooth();
      if (!enabled) {
        Alert.alert(
          'Bluetooth Error',
          'Please enable Bluetooth and try again.',
        );
        setLoading(false);
        return;
      }

      // Start scanning for devices
      const devices = await BluetoothManager.scanDevices();
      console.log('Found devices:', devices);

      // Get paired devices
      const found = JSON.parse(devices).found || [];
      const paired = JSON.parse(devices).paired || [];
      paired.concat(found);
      setPairedDevices(paired);
    } catch (error) {
      console.error('Error scanning devices:', error);
      Alert.alert('Error', 'Failed to scan devices');
    } finally {
      setLoading(false);
    }
  };

  const connectPrinter = async address => {
    try {
      await BluetoothManager.connect(address);
      Alert.alert('Success', 'Printer connected successfully');
    } catch (error) {
      console.error('Error connecting printer:', error);
      Alert.alert('Error', 'Failed to connect printer');
    }
  };

  const printTestReceipt = async () => {
    try {
      // await BluetoothEscposPrinter.printerInit();
      // let line = 'تمن الاجمالي';
      // await BluetoothEscposPrinter.printText(`${line}\n`, {
      //   encoding: 'CP864',
      //   codepage: 27,
      // });
      // await BluetoothEscposPrinter.printText(`\n\n\r`, {});

      // const text = 'تمن الاجمالي';
      // const encoding = 'CP864'; // Change based on printer support
      // const arabicBuffer = Buffer.from(text, encoding);
      // await BluetoothEscposPrinter.printRawData(
      //   '\xd8\xaa\xd9\x85\xd9\x86\x20\xd8\xa7\xd9\x84\xd8\xa7\xd8\xac\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a',
      //   {},
      // );

      const imageUri = ArabicText;
      console.log('Image URI:', ArabicText);
      // Print the image
      await BluetoothEscposPrinter.printPic(imageUri, {
        width: 384, // Adjust width to match printer's printable width
        left: 0,
      });

      await BluetoothEscposPrinter.printText('\n\n\r', {});

      // // Print store header
      // await BluetoothEscposPrinter.printText(
      //   '--------------------------------\n',
      //   {},
      // );
      // await BluetoothEscposPrinter.printQRCode(
      //   '' + 'A2001500000C0028',
      //   180,
      //   BluetoothEscposPrinter.ERROR_CORRECTION.L,
      // );
      // await BluetoothEscposPrinter.printText('    AVIS DE CONTRAVENTION\n', {
      // fonttype: 2,
      // widthtimes: 1,
      // heigthtimes: 1,
      // });
      // await BluetoothEscposPrinter.printText(
      //   '--------------------------------\n',
      //   {},
      // );

      // // Print date
      // await BluetoothEscposPrinter.printText(
      //   `Date: ${new Date().toLocaleString()}\n`,
      //   {},
      // );
      // await BluetoothEscposPrinter.printText('\n', {});

      // // Print items
      // await BluetoothEscposPrinter.printColumn(
      //   [32, 8],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //   ['Item 1', '$10.00'],
      //   {},
      // );
      // await BluetoothEscposPrinter.printColumn(
      //   [8, 12],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //   ['Item 2', '$20.00'],
      //   {},
      // );
      // await BluetoothEscposPrinter.printColumn(
      //   [8, 32],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER],
      //   ['Item 2', '21321 dwa5654654 wad'],
      //   {},
      // );
      // let dd = '236 ';
      // await BluetoothEscposPrinter.printText(
      //   `Amount:                         ${dd}MAD\n`,
      //   {},
      // );

      // // Print total
      // await BluetoothEscposPrinter.printText(
      //   '--------------------------------\n',
      //   {},
      // );
      // await BluetoothEscposPrinter.printColumn(
      //   [32, 8],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //   ['TOTAL', '$30.00'],
      //   {},
      // );

      // // Print footer
      // await BluetoothEscposPrinter.printText('\n', {});
      // await BluetoothEscposPrinter.printText('Thank you for your business!\n', {
      //   align: BluetoothEscposPrinter.ALIGN.CENTER,
      // });
      // await BluetoothEscposPrinter.printText('\n\n', {});

      // await BluetoothEscposPrinter.printColumn(
      //   [12, 8,12],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
      //   ['Amount', ' ','250.00 MAD'],
      //   {},
      // );

      // await BluetoothEscposPrinter.printColumn(
      //   [12, 8, 12],
      //   [
      //     BluetoothEscposPrinter.ALIGN.LEFT,
      //     BluetoothEscposPrinter.ALIGN.CENTER,
      //     BluetoothEscposPrinter.ALIGN.RIGHT,
      //   ],
      //   ['��من ��ل��جم��لي', ' ', `400 MAD`],
      //   {heigthtimes: 1, widthtimes: 0, codepage: 25, encoding: 'CP720'},
      // );
      // let line = 'بببببببببثس صيشيصش صشي';

      // await BluetoothEscposPrinter.printText(`à����aa\n`, {
      //   codepage: 5,
      //   encoding: 'CP863',
      // });

      // const testText = '��لم��ل�� ��ل��جم��لي ';
      // for (let i = 60; i <= 255; i++) {
      //   await BluetoothEscposPrinter.printText(`Codepage ${i}: ${testText}\n`, {
      //     codepage: i,
      //     encoding: 'Arabic',
      //   });
      // }

      // codepage: 27
      // await BluetoothEscposPrinter.printText(`\r\n`, {});
      // await BluetoothEscposPrinter.printText(
      //   `Infraction : dwawd adreytytr\n`,
      //   {},
      // );

      // await BluetoothEscposPrinter.printText(
      //   '--------------------------------\n\r',
      //   {},
      // );
      // Cut paper
      //   await BluetoothEscposPrinter.cutOnePoint();
    } catch (error) {
      console.error('Error printing:', error);
      Alert.alert('Error', 'Failed to print receipt');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={scanDevices}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Scan en cours...' : 'Scanner les imprimantes Bluetooth'}
        </Text>
      </TouchableOpacity>

      <View style={styles.devicesContainer}>
        <Text style={styles.sectionTitle}>
          Available Devices ({pairedDevices.length})
        </Text>
        {pairedDevices.map((device, index) => (
          <TouchableOpacity
            key={device.address || index}
            style={styles.deviceItem}
            onPress={() => connectPrinter(device.address)}>
            <Text style={styles.deviceName}>
              {device.name || 'Appareil Inconnu'}
            </Text>
            <Text style={styles.deviceAddress}>{device.address}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={printTestReceipt}>
        <Text style={styles.buttonText}>Print Test Receipt</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
});

export default TestScreen;
