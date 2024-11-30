import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
} from 'react-native-paper';
import {PHOTO_URL} from '../../../../../afterWillbeEnv';
import {getInfraction, processPayment} from '../../../../api/infractionRequest';
import styles from './styles';
import {formatDateTime, PLACEHOLDER_IMAGE} from './constants';
import DetailRow from './components/DetailRow';
import PhotoViewer from './components/PhotoViewer';
import InfractionHeader from './components/InfractionHeader';
import AmountCard from './components/AmountCard';
import LoadingComponent from '../../../../components/LoadingComponent';
import PaymentModal from '../../../../components/PaymentModal';
import Toast from 'react-native-toast-message';
// import useInfractionTicketPrinter from '../../hooks/useInfractionTicketPrinter';
import useInfractionTicketPrinter from '../../hooks/useInfractionTicketPrinter1';
import usePaymentReceiptPrinter from '../../hooks/usePaymentReceiptPrinter';
import PrintModal from '../../../../components/PrintModal';
import {useSelector} from 'react-redux';
import useArabicInfractionTicketPrinter from '../../hooks/useArabicInfractionTicketPrinter';

export default function InfractionDetail({navigation, route}) {
  const [infractionData, setInfractionData] = useState({});
  const [imageLoadError, setImageLoadError] = useState({});
  const [loading, setLoading] = useState(false);
  const [photoViewerConfig, setPhotoViewerConfig] = useState({
    visible: false,
    initialIndex: 0,
    photos: [],
  });

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);

  const {printInfractionTicket} = useInfractionTicketPrinter();
  const {printInfractionTicketAr} = useArabicInfractionTicketPrinter();
  const {printPaymentReceipt} = usePaymentReceiptPrinter();

  const user = useSelector(state => state.agent.info);

  const isAuthentificatedToPay = [
    'Constateur+Caissier',
    'Caissier',
    'Administrateur',
    'Supervisor',
  ].includes(user?.role);

  useEffect(() => {
    if (route.params?.id) {
      showInfractionDetail(route.params.id);
    }
  }, [route.params?.id]);

  const showInfractionDetail = async id => {
    setLoading(true);
    try {
      const response = await getInfraction(id);
      if (response.status === 200) {
        setInfractionData(response.data);
        if (response.data.photos) {
          const photoUrls = response.data.photos
            .split(',')
            .map(photo => PHOTO_URL + photo);
          setPhotoViewerConfig(prev => ({...prev, photos: photoUrls}));
        }
      }
    } catch (error) {
      console.error('Error fetching infraction details:', error);
      navigation.navigate('Home', {
        message: 'Error fetching infraction details',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = index => {
    setImageLoadError(prev => ({...prev, [index]: true}));
  };

  const openPhotoViewer = index => {
    console.log('d', index);
    setPhotoViewerConfig(prev => ({
      ...prev,
      visible: true,
      initialIndex: index,
    }));
  };

  const closePhotoViewer = () => {
    setPhotoViewerConfig(prev => ({...prev, visible: false}));
  };

  const handlePrintTicket = () => {
    console.log('Printing infraction ticket...');
    // printInfractionTicket(infractionData);
    // printInfractionTicketAr(infractionData);
  };

  const handlePrintReceipt = () => {
    console.log('Printing receipt ticket...');
    printPaymentReceipt(infractionData);
    // Implement printing logic
  };

  const handlePayInfraction = async () => {
    try {
      const res = await processPayment(infractionData.id_infraction);
      setIsPaymentModalVisible(false);
      setIsPrintModalVisible(true);
      setPaymentResponse(res.data);
      // Toast.show({type: 'success', text1: 'Paiement réussi.'});
      // Optionally, refresh the infractions list after successful payment
      showInfractionDetail(infractionData.id_infraction);
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

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Détails de l'infraction" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.mainCard}>
          <Card.Content>
            <InfractionHeader
              typeInfraction={infractionData?.type_infraction?.name}
              status={infractionData?.status}
            />

            <AmountCard amount={infractionData?.amount} />

            <View style={styles.detailsSection}>
              <DetailRow
                icon="car-info"
                label="Véhicule"
                value={`${infractionData?.brand} ${infractionData?.model}`}
                subtitle={`License: ${infractionData?.matricule}`}
              />
              <DetailRow
                icon="account"
                label="Propriétaire"
                value={infractionData?.owner}
              />
              <DetailRow
                icon="clock-outline"
                label="Date et Heure"
                value={formatDateTime(infractionData?.datetime_infraction)}
              />
              <DetailRow
                icon="map-marker"
                label="Emplacement"
                value={infractionData?.location}
              />
            </View>

            {infractionData?.description && (
              <View style={styles.descriptionSection}>
                <Title style={styles.sectionTitle}>Description</Title>
                <Paragraph style={styles.description}>
                  {infractionData.description}
                </Paragraph>
              </View>
            )}
          </Card.Content>

          <Card.Actions style={styles.actions}>
            {/* <Button
              mode="contained"
              icon="printer"
              style={styles.primaryButton}
              labelStyle={styles.buttonLabel}
              onPress={handlePrintTicket}>
              Imprimer le infraction
            </Button> */}
            {infractionData.status === 'pending' ? (
              isAuthentificatedToPay && (
                <Button
                  mode="outlined"
                  icon="receipt"
                  style={styles.secondaryButton}
                  labelStyle={styles.secondaryButtonLabel}
                  onPress={() => setIsPaymentModalVisible(true)}>
                  Payer
                </Button>
              )
            ) : (
              <>
                {/* <Button
                        mode="outlined"
                        icon="receipt"
                        style={styles.secondaryButton}
                        labelStyle={styles.secondaryButtonLabel}
                        onPress={handlePrintReceipt}>
                        Imprimer le reçu
                      </Button> */}
              </>
            )}
          </Card.Actions>
        </Card>

        {photoViewerConfig.photos.length > 0 && (
          <View style={styles.photoSection}>
            <Title style={styles.sectionTitle}>Photos</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photoGrid}>
                {photoViewerConfig.photos.map((photo, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openPhotoViewer(index)}
                    style={styles.photoWrapper}>
                    <Image
                      source={
                        imageLoadError[index] ? PLACEHOLDER_IMAGE : {uri: photo}
                      }
                      onError={() => handleImageError(index)}
                      style={styles.photo}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <PhotoViewer
        visible={photoViewerConfig.visible}
        photos={photoViewerConfig.photos}
        initialPhotoIndex={photoViewerConfig.initialIndex}
        onClose={closePhotoViewer}
      />

      <PaymentModal
        visible={isPaymentModalVisible}
        onDismiss={() => setIsPaymentModalVisible(false)}
        onConfirm={handlePayInfraction}
        infraction={infractionData}
      />
      <PrintModal visible={isPrintModalVisible} onConfirm={printReceipt} />
    </View>
  );
}
