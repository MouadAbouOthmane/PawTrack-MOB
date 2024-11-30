import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, Card, Title, Paragraph, Button} from 'react-native-paper';
import {useSelector} from 'react-redux';

const InfractionCard = ({infraction, onView, onPay}) => {
  const theme = useTheme();
  const user = useSelector(state => state.agent.info);
  const isAuthentificatedToPay = [
    'Constateur+Caissier',
    'Caissier',
    'Administrateur',
    'Supervisor',
  ].includes(user?.role);
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{infraction.matricule || 'N/A'}</Title>
          <Paragraph>
            {new Date(infraction.datetime_infraction).toLocaleString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Paragraph>
        </View>
        <View style={styles.cardBody}>
          <Paragraph style={{maxWidth: 180}}>{infraction.type_infraction?.name || 'Inconnu'}</Paragraph>
          <Paragraph style={[styles.amount, {color: theme.colors.error}]}>
            {infraction.amount} MAD
          </Paragraph>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          icon="eye"
          mode="outlined"
          onPress={() => onView(infraction.id_infraction)}>
          Voir
        </Button>
        {infraction.status === 'pending' && isAuthentificatedToPay && (
          <Button
            icon="credit-card"
            mode="contained"
            onPress={() => onPay(infraction.id_infraction)}>
            Payer
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InfractionCard;
