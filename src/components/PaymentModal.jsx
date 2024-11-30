import React from 'react';
import {
  Modal,
  Portal,
  Button,
  Card,
  Paragraph,
  Title,
} from 'react-native-paper';
import {StyleSheet} from 'react-native';

export default function PaymentModal({
  visible,
  onDismiss,
  onConfirm,
  infraction,
}) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.containerStyle}>
        <Card>
          <Card.Content>
            <Title style={styles.title}>Confirmer le paiement</Title>
            <Paragraph style={styles.description}>
              Registration number : {infraction?.matricule}
            </Paragraph>
            <Paragraph style={styles.amount}>
              Montant : ${infraction?.amount ? infraction.amount : '0.00'}
            </Paragraph>
            <Paragraph style={styles.question}>
              Voulez-vous continuer avec le paiement ?
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button onPress={onDismiss} style={styles.button} mode="outlined">
              Annuler
            </Button>
            <Button onPress={onConfirm} style={styles.button} mode="contained">
              Payer maintenant
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    margin: 20,
    elevation: 0,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    marginBottom: 24,
  },
  actions: {
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 8,
  },
});
