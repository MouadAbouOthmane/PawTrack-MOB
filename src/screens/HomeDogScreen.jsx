import React, {useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScanModal from '../components/ScanModal';
import {useDogTracking} from '../hooks/DogTrackingContext';
import Toast from 'react-native-toast-message';

const HomeDogScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {getDogDetailByUhfTag} = useDogTracking();

  const [scannedRfid, setScannedRfid] = useState('');

  const handleScanDog = () => {
    setScannedRfid('');
    setModalVisible(true);
  };

  const handleAddDog = () => {
    console.log('Add dog pressed');
    navigation.navigate('DogCreate');
  };

  const handleScanComplete = async rfidValue => {
    setScannedRfid(rfidValue);
    const dog = await getDogDetailByUhfTag(rfidValue);
    if (dog) {
      navigation.navigate('DogDetail', {dogId: dog.id});
    } else {
      Toast.show({
        type: 'error',
        text1: 'Aucun chien trouvé avec ce tag UHF.',
        visibilityTime: 1800,
      });
    }
    // Additional logic for handling scanned RFID
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/hh.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleScanDog}
          style={styles.button}
          labelStyle={{color: '#d25c3d'}}
          icon={({size}) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={size}
              color="#d25c3d"
            />
          )}>
          Scan
        </Button>
        <Button
          mode="contained"
          onPress={handleAddDog}
          style={styles.button}
          labelStyle={{color: '#d25c3d'}}
          icon={({size}) => (
            <MaterialCommunityIcons name="dog" size={size} color="#d25c3d" />
          )}>
          Ajouter
        </Button>
      </View>
      <ScanModal
        visible={modalVisible}
        onDismiss={handleCloseModal}
        onScan={handleScanComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#d25c3d',
  },
  image: {
    width: 350,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute', // Position the container
    bottom: 60, // Distance from the bottom of the screen
    flexDirection: 'row', // Place buttons in a row
    justifyContent: 'space-between', // Add space between buttons
    width: '90%', // Take up 90% of the screen width
  },
  button: {
    flex: 1, // Make buttons occupy equal space
    marginHorizontal: 8, // Add horizontal spacing between buttons
    backgroundColor: 'white',
    color: '#d25c3d',
  },

  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  rfidIcon: {
    marginVertical: 24,
  },
  modalHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
});

export default HomeDogScreen;
