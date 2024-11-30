import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../components/Header';
import InfractionCard from '../components/InfractionCard';
import BottomNavBar from '../components/BottomNavBar';
import PaymentModal from '../components/PaymentModal';
import {allInfraction, processPayment} from '../api/infractionRequest';
import LoadingComponent from '../components/LoadingComponent';
import PrintModal from '../components/PrintModal';
import usePaymentReceiptPrinter from '../features/infractions/hooks/usePaymentReceiptPrinter';
import {useSelector} from 'react-redux';

const Infractions = ({navigation}) => {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInfraction, setSelectedInfraction] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);

  const {printPaymentReceipt} = usePaymentReceiptPrinter();

  const user = useSelector(state => state.agent.info);

  const theme = useTheme();

  const fetchInfractions = async () => {
    setLoading(true);
    try {
      const res = await allInfraction();
      setInfractions(res.data);
    } catch (err) {
      console.error('Error fetching infractions:', err);
      Toast.show({
        type: 'error',
        text1: 'Échec de la récupération des infractions.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfractions();
  }, []);

  const handleView = id => {
    navigation.navigate('InfractionDetail', {id});
  };

  const handlePay = infraction => {
    setSelectedInfraction(infraction);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = async () => {
    // Implement your payment logic here
    // For example:
    try {
      const res = await processPayment(selectedInfraction.id_infraction);
      setIsPaymentModalVisible(false);
      setIsPrintModalVisible(true);
      setPaymentResponse(res.data);

      // Toast.show({type: 'success', text1: 'Paiement réussi.'});
      // Optionally, refresh the infractions list after successful payment
      fetchInfractions();
    } catch (err) {
      console.error('Error processing payment:', err);
      Toast.show({type: 'error', text1: 'Échec du traitement du paiement.'});
    }
  };

  const printReceipt = async () => {
    try {
      await printPaymentReceipt(
        paymentResponse.payment,
        paymentResponse.infraction,
      );
      setIsPrintModalVisible(false);
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
      <Header
        title="Infractions du jour."
        onSettingsPress={() => navigation.navigate('Settings')}
      />
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
          contentContainerStyle={[styles.listContent, {paddingBottom: 100}]}
          refreshing={loading}
          onRefresh={fetchInfractions}
          initialNumToRender={10}
          windowSize={5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="alert" size={48} color={theme.colors.primary} />
              <Text style={styles.emptyText}>Aucune infraction trouvée.</Text>
            </View>
          }
        />
      )}
      {user?.role !== 'Caissier' && (
        <TouchableOpacity
          style={[styles.fab, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.navigate('CreateInfraction')}
          accessibilityLabel="Create new infraction"
          accessibilityRole="button">
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
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
  listContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 60,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Infractions;
