import React, {useRef, useState, useEffect} from 'react';
import {Animated, NativeEventEmitter, NativeModules} from 'react-native';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import Sound from 'react-native-sound';
import dings from '../assets/sound/bell.wav';

const ScanModal = ({visible, onDismiss, onScan}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isListening, setIsListening] = useState(false);

  // Initialize sound
  const ding = new Sound(dings, error => {
    if (error) {
      console.log('Failed to load the sound', error);
    }
  });

  const theme = useTheme();

  useEffect(() => {
    let eventEmitter;

    if (visible && isListening) {
      eventEmitter = new NativeEventEmitter(NativeModules.CalendarModule);

      eventEmitter.addListener('EventReminder', event => {
        ding.play();
        const scannedValue = event.eventProperty;
        handleClose();
        onScan(scannedValue); // Callback to parent component with scanned value
        eventEmitter.removeAllListeners('EventReminder');
      });
    }

    return () => {
      if (eventEmitter) {
        eventEmitter.removeAllListeners('EventReminder');
      }
    };
  }, [visible, isListening]);

  useEffect(() => {
    if (visible) {
      // Animate modal in
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Reset state and start listening
      setIsListening(true);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsListening(false);
      onDismiss();
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
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
            {isListening ? 'Scan en cours...' : ''}
          </Text>
          <Button
            mode="outlined"
            onPress={handleClose}
            style={styles.closeButton}>
            Fermer
          </Button>
        </Animated.View>
      </Modal>
    </Portal>
  );
};

const styles = {
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
  closeButton: {
    // Add any specific styling for the close button if needed
  },
};

export default ScanModal;
