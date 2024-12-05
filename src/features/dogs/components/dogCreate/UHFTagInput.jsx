import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, IconButton, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import ScanModal from '../../../../components/ScanModal';
import {useDogTracking} from '../../../../hooks/DogTrackingContext';
import Toast from 'react-native-toast-message';

const UHFTagInput = ({value, onChangeText}) => {
  const {getDogDetailByUhfTag} = useDogTracking();
  const theme = useTheme();
  const [scanModalVisible, setScanModalVisible] = useState(false);

  const handleRFIDScan = async scannedValue => {
    try {
      if ((await getDogDetailByUhfTag(scannedValue)) === null) {
        onChangeText(scannedValue);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Cette tag UHF est déja attachée à un chien ',
        });
        onChangeText('');
      }
    } catch (e) {
      Toast.show({type: 'error', text1: 'Échec du traitement'});
      onChangeText('');
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface}]}
        label="Tag UHF"
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        disabled
      />
      <IconButton
        icon={() => (
          <Icon name="qr-code" size={24} color={theme.colors.primary} />
        )}
        size={24}
        onPress={() => {
          /* Implement scan functionality */
          setScanModalVisible(true);
        }}
        style={[styles.scanButton, {borderColor: theme.colors.primary}]}
      />
      <ScanModal
        visible={scanModalVisible}
        onDismiss={() => setScanModalVisible(false)}
        onScan={handleRFIDScan}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  scanButton: {
    margin: 0,
    borderWidth: 1,
    backgroundColor: 'white',
  },
});

export default UHFTagInput;
