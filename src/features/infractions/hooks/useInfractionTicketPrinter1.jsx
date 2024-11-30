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
    return defaultPrinter.address ? defaultPrinter.address : null;
  };

  const printInfractionTicket = async infraction => {
    if (!defaultPrinterAddress) {
      Alert.alert(
        'Impression impossible',
        "Aucune imprimante par défaut n'est configurée",
      );
      throw new Error('No default printer configured');
    }
    try {
      await BluetoothManager.connect(defaultPrinterAddress);
      await BluetoothEscposPrinter.printerInit();
      await printTicketHeader();
      await printTicketInformation();
      await printInfractionDetails(infraction);
      await printTicketFooter();
    } catch (error) {
      console.error("Erreur lors de l'impression du ticket :", error);
      Alert.alert(
        'Impression impossible',
        'Vérifiez votre connexion Bluetooth',
      );
      throw error;
    }
  };

  const printTicketHeader = async () => {
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
    await BluetoothEscposPrinter.printText('     AVIS DE CONTRAVENTION\n', {
      fonttype: 2,
      heigthtimes: 1,
      codepage: 4,
      encoding: 'CP863',
    });
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
  };

  const printInfractionDetails = async infraction => {
    await printLineWithTruncation(
      `\nVéhicule : ${infraction.brand} ${infraction.model}\n`,
    );
    await printLineWithTruncation(
      `Immatriculation : ${infraction.matricule}\n`,
    );
    await printLineWithTruncation(`Propriétaire : ${infraction.owner}\n`);
    await printParagraph(
      `Date et heure: ${formatDateTime(
        infraction.datetime_infraction,
      )}\n`,
    );
    await printParagraph(`Lieu : ${infraction.location}\n`);
    await printParagraph(`Infraction : ${infraction.type_infraction.name}\n`);
    await BluetoothEscposPrinter.printColumn(
      [12, 8, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['Montant', ' ', `${infraction.amount} MAD`],
      {heigthtimes: 1, widthtimes: 0},
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.RIGHT,
    );
    await BluetoothEscposPrinter.printQRCode(
      '' + infraction.qr_code,
      150,
      BluetoothEscposPrinter.ERROR_CORRECTION.L,
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
  };

  const printTicketInformation = async () => {
    await printParagraph(
      'Une infraction à la réglementation du stationnement a été relevée à votre encontre.\n',
    );
    await printParagraph(
      'Pour le règlement, veuillez suivre les modalités indiquées.\n',
    );
  };

  const printTicketFooter = async () => {
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n',
      {},
    );
    await printParagraph(
      "Important : Rémunérer votre contravention sous 48h dans l'un de nos points de paiement pour éviter des frais supplémentaires.\n",
    );
    await printParagraph(
      "Aucune réclamation ne sera prise en compte sans l'avis de contravention.\n",
    );
    await printParagraph(
      'Pour toute question, veuillez nous contacter au 06 66 66 66 66 ou visiter example.com.\n\n',
    );
    await BluetoothEscposPrinter.printText('\n\n\r\n', {});
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
  return {printInfractionTicket};
};

export default useInfractionTicketPrinter;
