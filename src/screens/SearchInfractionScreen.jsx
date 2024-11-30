import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  Text,
  Keyboard,
  Alert,
} from 'react-native';
import {useTheme, Button, Portal, Dialog, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import InfractionCard from '../components/InfractionCard';
import {
  processPayment,
  searchInfractionByMatricule,
  searchInfractionByQrCode,
} from '../api/infractionRequest';
import PaymentModal from '../components/PaymentModal';
import BottomNavBar from '../components/BottomNavBar';
import LoadingComponent from '../components/LoadingComponent';
import PrintModal from '../components/PrintModal';
import usePaymentReceiptPrinter from '../features/infractions/hooks/usePaymentReceiptPrinter';

const SearchInfractionScreen = ({navigation}) => {
  const [selectedInfraction, setSelectedInfraction] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [rfidValue, setRfidValue] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  const hiddenInputRef = useRef(null);
  const theme = useTheme();

  const {printPaymentReceipt} = usePaymentReceiptPrinter();

  const fetchInfraction = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const res = await searchInfractionByMatricule(searchQuery);
      console.log(res.data);
      setInfractions(res.data);
    } catch (err) {
      setInfractions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = id => {
    navigation.navigate('InfractionDetail', {id});
  };

  const handlePay = infraction => {
    setSelectedInfraction(infraction);
    setIsPaymentModalVisible(true);
  };

  const openQRScanner = () => {
    setIsQRModalVisible(true);
    // Focus the hidden input after a short delay to ensure the modal is visible
    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);
  };

  const handleQRCodeScanned = async data => {
    try {
      const res = await searchInfractionByQrCode(data);
      setIsQRModalVisible(false);
      handleView(res.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Infraction non trouvée',
        visibilityTime: 1800,
      });
      console.log('Error scanning QR code:', error);
    } finally {
      // Clear the RFID value after processing
      setRfidValue(prev => '');
    }
  };

  const handlePaymentConfirm = async () => {
    // Implement your payment logic here
    // For example:
    try {
      const res = await processPayment(selectedInfraction.id_infraction);
      setIsPaymentModalVisible(false);
      setIsPrintModalVisible(true);
      setPaymentResponse(res.data);
      // Toast.show({
      //   type: 'success',
      //   text1: 'Paiement réussi',
      //   visibilityTime: 1800,
      // });

      // Optionally, refresh the infractions list after successful payment
      fetchInfraction();
    } catch (err) {
      console.error('Error processing payment:', err);
      Toast.show({
        type: 'error',
        text1: 'Échec du traitement du paiement',
        visibilityTime: 1800,
      });
    }
  };

  const printReceipt = async () => {
    try {
      await printPaymentReceipt(
        paymentResponse.payment,
        paymentResponse.infraction,
      );
      setIsPrintModalVisible(false);
      setPaymentResponse(null);
    } catch (error) {
      console.error("Erreur lors de l'impression du reçu de paiement:", error);
      Alert.alert(
        'Impression impossible',
        'Verifiez votre connexion Bluetooth',
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Surface style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Icon
            name="magnify"
            size={24}
            color={theme.colors.primary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Matricule"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={fetchInfraction}
            returnKeyType="search"
            placeholderTextColor={theme.colors.placeholder}
          />
          <Button
            mode="contained"
            onPress={fetchInfraction}
            style={styles.searchButton}>
            Rechercher
          </Button>
        </View>
        <Button
          mode="outlined"
          onPress={openQRScanner}
          icon="qrcode-scan"
          style={styles.qrButton}>
          Scanner le code QR
        </Button>
      </Surface>

      {loading ? (
        <LoadingComponent />
      ) : (
        <FlatList
          data={infractions}
          keyExtractor={item => item.id_infraction}
          renderItem={({item}) => (
            <InfractionCard
              infraction={item}
              onView={handleView}
              onPay={() => handlePay(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="alert" size={48} color={theme.colors.primary} />
              <Text style={styles.emptyText}>Aucune infraction trouvée.</Text>
            </View>
          }
        />
      )}

      <Portal>
        <Dialog
          visible={isQRModalVisible}
          onDismiss={() => setIsQRModalVisible(false)}>
          <Dialog.Title>Scan QR Code</Dialog.Title>
          <Dialog.Content>
            <Text>
              Veuillez utiliser le bouton de scanner de votre appareil pour
              scanner le code QR.
            </Text>
            <TextInput
              ref={hiddenInputRef}
              style={styles.hiddenInput}
              blurOnSubmit={false}
              value={rfidValue}
              autoFocus
              onChangeText={handleQRCodeScanned}
              showSoftInputOnFocus={false}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsQRModalVisible(false)}>Annuler</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <PaymentModal
        visible={isPaymentModalVisible}
        onDismiss={() => setIsPaymentModalVisible(false)}
        onConfirm={handlePaymentConfirm}
        infraction={selectedInfraction}
      />
      <PrintModal visible={isPrintModalVisible} onConfirm={printReceipt} />
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginRight: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  searchButton: {
    height: 40,
    justifyContent: 'center',
  },
  qrButton: {
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
  },
});

export default SearchInfractionScreen;
