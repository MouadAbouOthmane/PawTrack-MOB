import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';
import {useSelector} from 'react-redux';
import {formatDateTime} from '../components/InfractionDetail/constants';

const usePaymentReceiptPrinter = () => {
  const defaultPrinter = useSelector(state => state.settings.defaultPrinter);
  const [defaultPrinterAddress, setDefaultPrinterAddress] = useState(null);

  useEffect(() => {
    const storedAddress = getUserDefaultPrinterAddress();
    setDefaultPrinterAddress(storedAddress);
  }, []);

  const getUserDefaultPrinterAddress = () => {
    return defaultPrinter?.address || null;
  };

  const printPaymentReceipt = async (payment, infraction) => {
    if (!defaultPrinterAddress) {
      Alert.alert(
        'Impression impossible',
        "Aucune imprimante par defaut n'est configuree",
      );
      throw new Error('No default printer configured');
    }
    try {
      await BluetoothManager.connect(defaultPrinterAddress);
      await BluetoothEscposPrinter.printerInit();
      await printReceiptHeader();
      await printReceiptDetails(payment, infraction);
      await printReceiptFooter();
    } catch (error) {
      console.error("Erreur lors de l'impression du recu de paiement:", error);
      Alert.alert(
        'Impression impossible',
        'Verifiez votre connexion Bluetooth',
      );
      throw error;
    }
  };

  const printReceiptHeader = async () => {
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
    await BluetoothEscposPrinter.printText('REÇU DE PAIEMENT\n', {
      // fonttype: 2
      widthtimes: 1,
      codepage: 4,
      encoding: 'CP863',
      heigthtimes: 1,
    });
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
  };

  const printReceiptDetails = async (payment, infraction) => {
    // Section Détails du Paiement
    await BluetoothEscposPrinter.printText('\nDétails du paiement:\n', {
      fonttype: 3,
      heigthtimes: 1,
      codepage: 4,
      encoding: 'CP863',
    });
    await printLineWithTruncation(`Date et heure :`);
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.RIGHT,
    );
    await printLineWithTruncation(`${formatDateTime(payment.payment_date)}\n`);
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
    await printLineWithTruncation(`Montant payé : ${payment.amount} MAD\n`);

    // Section Informations sur l'Infraction
    await BluetoothEscposPrinter.printText("\nDétails de l'infraction:\n", {
      fonttype: 3,
      heigthtimes: 1,
      codepage: 4,
      encoding: 'CP863',
    });
    await printLineWithTruncation(
      `Immatriculation : ${infraction.matricule}\n`,
    );
    await printLineWithTruncation(`Date et heure :`);
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.RIGHT,
    );
    await printLineWithTruncation(
      `${formatDateTime(infraction.datetime_infraction)}\n`,
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
    await printParagraph(
      `Infraction : ${infraction.type_infraction.name}\n`,
    );
    await printParagraph(`Lieu : ${infraction.location}\n`);

    // Section Code QR
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER,
    );
    await BluetoothEscposPrinter.printQRCode(
      '' + infraction.qr_code,
      150,
      BluetoothEscposPrinter.ERROR_CORRECTION.L,
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
    await BluetoothEscposPrinter.printText('\n', {});
  };

  const printReceiptFooter = async () => {
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
    await printParagraph('Merci pour votre paiement.\n');
    await printParagraph('Veuillez conserver ce reçu pour référence future.\n');
    await printParagraph(
      'Pour toute assistance, veuillez contacter notre service client.',
    );
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\n',
      {},
    );
  };

  const printLineWithTruncation = async line => {
    await BluetoothEscposPrinter.printText(`${line}\n`, {
      codepage: 4,
      encoding: 'CP863',
    });
  };

  const wrapTextWithoutCuttingWords = (text, maxLineWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxLineWidth) {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  const printParagraph = async text => {
    const lines = wrapTextWithoutCuttingWords(text, 30);
    for (const line of lines) {
      await BluetoothEscposPrinter.printText(`${line}\n`, {
        codepage: 4,
        encoding: 'CP863',
      });
    }
    // Add an empty line after the paragraph
    await BluetoothEscposPrinter.printText('\n', {});
  };

  return {printPaymentReceipt};
};

export default usePaymentReceiptPrinter;
