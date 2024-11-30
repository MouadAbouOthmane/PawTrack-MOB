import React, {useState, useRef} from 'react';
import {View, StyleSheet, Image, Animated} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Card,
  IconButton,
  Portal,
  Modal,
  Snackbar,
} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {login} from '../redux/slices/agentSlice';
import {loginAgent, loginRfidAgent} from '../api/agentRequests';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [rfidValue, setRfidValue] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rfidInputRef = useRef(null);

  const dispatch = useDispatch();
  const theme = useTheme();

  const validateForm = () => {
    let errorsObj = {};
    if (!email) {
      errorsObj.email = "L'email est requis.";
    }
    if (!password) {
      errorsObj.password = 'Le mot de passe est requis.';
    }
    setErrors(errorsObj);
    return Object.keys(errorsObj).length === 0;
  };

  const handleLogin = async () => {
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const agentData = await loginAgent(email, password);
      dispatch(login(agentData.data));
      navigation.replace('Home');
    } catch (error) {
      setErrors({general: Object.values(error.response.data).join(', ')});
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = () => {
    setModalVisible(true);
    setRfidValue('');
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      // Focus the hidden input after animation completes
      if (rfidInputRef.current) {
        rfidInputRef.current.focus();
        // Keyboard.dismiss();
      }
    });
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setRfidValue('');
    });
  };

  const handleRfidSubmit = async v => {
    if (v) {
      try {
        const res = await loginRfidAgent(v);
        dispatch(login(res.data));
        navigation.replace('Home');
        hideModal();
        setSnackbarVisible(true);
      } catch (error) {
        console.error('Error scanning RFID:', error);
      } finally {
        // Clear the RFID value after processing
        setRfidValue(prev => '');
      }

      // Here you can handle the RFID value (e.g., send to server)
      console.log('RFID Value:', v);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            style={styles.input}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            error={!!errors.password}
            style={styles.input}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}>
            Connexion
          </Button>
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
        </Card.Content>
      </Card>

      <IconButton
        icon="credit-card"
        size={42}
        iconColor="#fff"
        onPress={showModal}
        style={[{backgroundColor: theme.colors.primary}, styles.circleButton]}
      />

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
            <Text style={styles.modalTitle}>Authentification</Text>
            <Text style={styles.modalSubtitle}>Carte RFID</Text>
            <Text style={styles.modalText}>
              Veuillez scanner  carte RFID pour accéder à l'application.{' '}
            </Text>
            <IconButton
              icon="contactless-payment"
              size={80}
              iconColor={theme.colors.primary}
              style={styles.rfidIcon}
            />
            <Text style={styles.modalHint}>
              Placez votre carte près du scanner.{' '}
            </Text>
            {/* Hidden input for RFID scanner */}
            <TextInput
              ref={rfidInputRef}
              value={rfidValue}
              onChangeText={handleRfidSubmit}
              autoFocus={modalVisible}
              blurOnSubmit={false}
              style={styles.hiddenInput}
              showSoftInputOnFocus={false}
            />
            <Button
              mode="outlined"
              onPress={hideModal}
              style={styles.closeButton}>
              FERMER
            </Button>
          </Animated.View>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}>
        Carte scannée avec succès !
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 140,
    height: 140,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  circleButton: {
    alignSelf: 'center',
    marginTop: 64,
    borderRadius: 50,
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
  closeButton: {
    width: '100%',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },

  snackbar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'purple',
  },
});
