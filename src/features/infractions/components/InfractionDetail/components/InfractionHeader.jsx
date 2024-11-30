// src/features/infractions/components/InfractionDetail/components/InfractionHeader.jsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, Title, useTheme} from 'react-native-paper';
import StatusChip from './StatusChip';

const InfractionHeader = ({typeInfraction, status}) => {
  const theme = useTheme();

  return (
    <View style={styles.headerSection}>
      <Avatar.Icon
        size={70}
        icon="car"
        style={[styles.avatar, {backgroundColor: theme.colors.primary}]}
      />
      <View style={styles.headerInfo}>
        <Title style={styles.title}>{typeInfraction}</Title>
        <StatusChip status={status} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default InfractionHeader;
