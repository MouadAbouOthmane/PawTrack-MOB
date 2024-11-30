import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import dings from '../assets/sound/bell.wav';

import Sound from 'react-native-sound';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeDogScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [rfidValue, setRfidValue] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Initialize sound
  const ding = new Sound(dings, Sound.MAIN_BUNDLE, error => {
    console.log(error);
  });
  // console.log(dings)

  const theme = useTheme();

  useEffect(() => {
    let eventEmitter;

    if (isListening) {
      eventEmitter = new NativeEventEmitter(NativeModules.CalendarModule);

      eventEmitter.addListener('EventReminder', event => {
        ding.play();
        setRfidValue(event.eventProperty);
        hideModal();
        eventEmitter.removeAllListeners('EventReminder');
      });

    }

    return () => {
      if (eventEmitter) {
        eventEmitter.removeAllListeners('EventReminder');
      }
    };
  }, [isListening]);

  const handleScanDog = () => {
    console.log('Scan dog pressed');
    showModal();
  };

  const handleAddDog = () => {
    console.log('Add dog pressed');
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      // setRfidValue('');
      setIsListening(false); // Stop listening when modal closes
    });
  };

  const showModal = () => {
    setModalVisible(true);
    setRfidValue('');
    setIsListening(true); // Start listening when modal opens
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/hh.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text>{rfidValue}</Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleScanDog}
          style={styles.button}
          icon={({size, color}) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={size}
              color={color}
            />
          )}>
          Scan
        </Button>
        <Button
          mode="contained"
          onPress={handleAddDog}
          style={styles.button}
          icon={({size, color}) => (
            <MaterialCommunityIcons name="dog" size={size} color={color} />
          )}>
          Ajouter
        </Button>
      </View>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.modalTitle}>Commencez le scan !</Text>
            <Text style={styles.modalSubtitle}>Scannez la puce RFID</Text>
            <Text style={styles.modalText}>
              Veuillez appuyer sur le bouton de votre PDA pour scanner la puce
              RFID sur l'oreille du chien.
            </Text>
            <IconButton
              icon="contactless-payment"
              size={80}
              iconColor={theme.colors.primary}
              style={styles.rfidIcon}
            />
            <Text style={styles.modalHint}>
              {isListening ? 'Scanning in progress...' : ''}
            </Text>
            <Button
              mode="outlined"
              onPress={hideModal}
              style={styles.closeButton}>
              Fermer
            </Button>
          </Animated.View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
