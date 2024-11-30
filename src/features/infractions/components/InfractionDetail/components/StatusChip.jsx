// src/features/infractions/components/InfractionDetail/components/StatusChip.jsx
import React from 'react';
import {StyleSheet} from 'react-native';
import {Chip, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StatusChip = ({status}) => {
  const theme = useTheme();

  const getStatusColor = status => {
    return status === 'paid' ? theme.colors.primary : theme.colors.error;
  };

  const statusIcon = {
    paid: 'check-circle',
    pending: 'alert-circle',
    canceled: 'alert-circle',
  };

  const statusText = {
    paid: 'Payé',
    pending: 'Non payé',
    canceled: 'Annulé',
  };

  return (
    <Chip
      icon={() => (
        <Icon
          name={statusIcon[status]}
          color="white" // Set icon color directly here
          size={20}
        />
      )}
      style={[styles.chip, {backgroundColor: getStatusColor(status)}]}
      textStyle={styles.text}>
      {statusText[status]}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});

export default StatusChip;
