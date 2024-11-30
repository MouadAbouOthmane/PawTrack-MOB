// src/features/infractions/components/InfractionDetail/components/AmountCard.jsx
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Card, Title} from 'react-native-paper';

const AmountCard = ({amount}) => {
  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        <Title style={styles.amountText}>{amount} MAD</Title>
        <Text style={styles.label}>Montant de l'amende</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
    borderRadius: 8,
  },
  content: {
    alignItems: 'center',
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  label: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
});

export default AmountCard;
