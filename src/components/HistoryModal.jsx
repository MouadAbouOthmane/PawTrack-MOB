import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Modal, Portal, Text, Button, List, useTheme} from 'react-native-paper';
import {formatDateTime} from '../utils/date';

const HistoryModal = ({visible, onDismiss, history}) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.containerStyle}>
        <View
          style={[styles.content, {backgroundColor: theme.colors.background}]}>
          <Text style={[styles.title, {color: theme.colors.primary}]}>
            Historique des événements
          </Text>
          <ScrollView style={styles.scrollView}>
            {history.map((event, index) => (
              <List.Item
                key={index}
                title={event.event_type}
                description={() => (
                  <View>
                    <Text>
                      Date: {formatDateTime(new Date(event.event_date))}
                    </Text>
                    <Text>
                      Lieu: {event.location.latitude.toFixed(4)},{' '}
                      {event.location.longitude.toFixed(4)}
                    </Text>
                    {event.note && <Text>Note: {event.note}</Text>}
                  </View>
                )}
                left={props => <List.Icon {...props} icon="calendar" />}
                style={styles.listItem}
              />
            ))}
          </ScrollView>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={styles.closeButton}>
            Fermer
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  content: {
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 400,
  },
  listItem: {
    paddingVertical: 8,
  },
  closeButton: {
    marginTop: 16,
  },
});

export default HistoryModal;
