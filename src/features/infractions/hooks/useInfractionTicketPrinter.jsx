import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';
import {useSelector} from 'react-redux';
import {formatDateTime} from '../components/InfractionDetail/constants';

const useInfractionTicketPrinter = () => {
  const defaultPrinter = useSelector(state => state.settings.defaultPrinter);
  const [defaultPrinterAddress, setDefaultPrinterAddress] = useState(null);

  useEffect(() => {
    const storedAddress = getUserDefaultPrinterAddress();
    setDefaultPrinterAddress(storedAddress);
  }, []);

  const getUserDefaultPrinterAddress = () => {
    if (defaultPrinter.address) {
      return defaultPrinter.address;
    } else {
      return null;
    }
  };

  const printInfractionTicket = async infraction => {
    if (!defaultPrinterAddress) {
      Alert.alert(
        'Impression impossible',
        "Aucune imprimante par défaut n'est configurée",
      );
      return;
    }

    try {
      await BluetoothManager.connect(defaultPrinterAddress);
      await BluetoothEscposPrinter.printerInit();
      await printTicketHeader();
      await printInfractionDetails(infraction);
      await printTicketFooter();
      await BluetoothEscposPrinter.cutOnePoint();
    } catch (error) {
      console.error("Erreur lors de l'impression du ticket:", error);
      Alert.alert(
        'Impression impossible',
        'Vérifiez votre connexion Bluetooth',
      );
    }
  };

  const printTicketHeader = async () => {
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
    await BluetoothEscposPrinter.printText('   AVIS DE CONTRAVENTION\n', {
      fonttype: 2,
      heigthtimes: 1,
    });
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
  };

  const printInfractionDetails = async infraction => {
    await printLineWithTruncation(
      `Véhicule : ${infraction.brand} ${infraction.model}\n`,
    );
    await printLineWithTruncation(
      `Immatriculation : ${infraction.matricule}\n`,
    );
    await printLineWithTruncation(`Propriétaire : ${infraction.owner}\n`);
    await printLineWithTruncation(
      `Date : ${formatDateTime(infraction.datetime_infraction)}\n\r`,
    );
    await printLineWithTruncation(`Lieu : ${infraction.location}\n\r`);
    await printLineWithTruncation(
      `Infraction : ${infraction.type_infraction.name}\n\r`,
    );
    await BluetoothEscposPrinter.printColumn(
      [12, 8, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['Amount', ' ', `${infraction.amount}  MAD`],
      {},
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.RIGHT,
    );
    await BluetoothEscposPrinter.printQRCode(
      '' + infraction.qr_code,
      150,
      BluetoothEscposPrinter.ERROR_CORRECTION.L,
    );
  };

  const printTicketFooter = async () => {
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );

    await BluetoothEscposPrinter.printText(
      "Important : Réglez votre contravention sous 48h dans l'un de nos points de paiement pour éviter des frais supplémentaires.\n",
      {widthtimes: 0},
    );
    await BluetoothEscposPrinter.printText('\n\n\r\n', {});
  };

  const printLineWithTruncation = async line => {
    const maxLineWidth = 40;
    const truncatedLine = line.slice(0, maxLineWidth);
    await BluetoothEscposPrinter.printText(`${truncatedLine}\n`, {});
  };

  return {printInfractionTicket};
};

export default useInfractionTicketPrinter;
