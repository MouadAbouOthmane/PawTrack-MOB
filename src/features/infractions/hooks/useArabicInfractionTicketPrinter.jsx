import {useState, useEffect, useRef} from 'react';
import {Alert, Platform, Text, View} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';
import {useSelector} from 'react-redux';
import {formatDateTime} from '../components/InfractionDetail/constants';
import * as text2png from 'text2png';

import RNFS from 'react-native-fs';
import {captureRef} from 'react-native-view-shot';

export const TextToImage = ({
  text,
  fontSize = 16,
  width = 384,
  backgroundColor = 'white',
  textColor = 'black',
  fontWeight = 'normal',
  textAlign = 'right',
  onCapture,
}) => {
  const viewRef = useRef(null);

  useEffect(() => {
    const captureImage = async () => {
      try {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        const base64 = await RNFS.readFile(uri, 'base64');
        await RNFS.unlink(uri);

        onCapture(base64);
      } catch (error) {
        console.error('Error capturing text image:', error);
        onCapture(null);
      }
    };

    captureImage();
  }, [text]);

  return (
    <View
      ref={viewRef}
      style={{
        width: width,
        backgroundColor: backgroundColor,
        padding: 10,
        alignItems: textAlign === 'right' ? 'flex-end' : 'flex-start',
      }}>
      <Text
        style={{
          fontSize: fontSize,
          color: textColor,
          fontWeight: fontWeight,
          textAlign: textAlign,
          fontFamily:
            Platform.OS === 'android' ? 'Traditional Arabic' : 'ArialHB',
        }}>
        {text}
      </Text>
    </View>
  );
};

const useArabicInfractionTicketPrinter = () => {
  const defaultPrinter = useSelector(state => state.settings.defaultPrinter);
  const [defaultPrinterAddress, setDefaultPrinterAddress] = useState(null);
  const [textImageComponent, setTextImageComponent] = useState(null);

  useEffect(() => {
    const storedAddress = getUserDefaultPrinterAddress();
    setDefaultPrinterAddress(storedAddress);
  }, []);

  const getUserDefaultPrinterAddress = () => {
    return defaultPrinter?.address || null;
  };

  // Utility function to create a base64 image from text
  const createTextImage = (text, options = {}) => {
    const {
      fontSize = 16,
      width = 384,
      textColor = 'black',
      backgroundColor = 'white',
    } = options;

    // Generate base64 image directly
    const base64 = text2png(text, {
      font: `${fontSize}px Arial`,
      color: textColor,
      backgroundColor: backgroundColor,
      output: 'base64',
    });

    return base64;
  };

  const printInfractionTicketAr = async infraction => {
    if (!defaultPrinterAddress) {
      Alert.alert('خطأ في الطباعة', 'لم يتم ضبط طابعة افتراضية');
      throw new Error('No default printer configured');
    }

    try {
      await BluetoothManager.connect(defaultPrinterAddress);
      await BluetoothEscposPrinter.printerInit();

      // Print header
      const headerBase64 = await createTextImage('إشعار مخالفة', {
        fontSize: 20,
        fontWeight: 'bold',
      });
      if (headerBase64) {
        await BluetoothEscposPrinter.printPic(headerBase64, {
          width: 384,
          left: 0,
        });
      }

      // Ticket information
      const infoTexts = [
        'تم تسجيل مخالفة لقواعد وقوف السيارات الخاصة بك.',
        'للدفع، يرجى اتباع التعليمات المحددة.',
      ];

      for (const text of infoTexts) {
        const base64 = await createTextImage(text);
        if (base64) {
          await BluetoothEscposPrinter.printPic(base64, {width: 384, left: 0});
        }
      }

      // Infraction details
      const detailsTexts = [
        `السيارة: ${infraction.brand} ${infraction.model}`,
        `رقم التسجيل: ${infraction.matricule}`,
        `المالك: ${infraction.owner}`,
        `التاريخ والوقت: ${formatDateTime(infraction.datetime_infraction)}`,
        `المكان: ${infraction.location}`,
        `نوع المخالفة: ${infraction.type_infraction.name}`,
        `المبلغ: ${infraction.amount} درهم`,
      ];

      for (const text of detailsTexts) {
        const base64 = await createTextImage(text);
        if (base64) {
          await BluetoothEscposPrinter.printPic(base64, {width: 384, left: 0});
        }
      }

      // Footer
      const footerTexts = [
        'هام: يُرجى تسديد الغرامة في غضون 48 ساعة لتجنب الرسوم الإضافية.',
        'لن يتم قبول أي شكوى دون تقديم إشعار المخالفة.',
        'لأي استفسار، يرجى الاتصال على 06 66 66 66 66 أو زيارة example.com.',
      ];

      for (const text of footerTexts) {
        const base64 = await createTextImage(text);
        if (base64) {
          await BluetoothEscposPrinter.printPic(base64, {width: 384, left: 0});
        }
      }

      // QR Code printing
      await BluetoothEscposPrinter.printQRCode(
        '' + infraction.qr_code,
        150,
        BluetoothEscposPrinter.ERROR_CORRECTION.L,
      );
    } catch (error) {
      console.error('خطأ أثناء الطباعة:', error);
      Alert.alert('خطأ في الطباعة', 'تأكد من اتصال البلوتوث بالطابعة');
      throw error;
    }
  };

  return {printInfractionTicketAr, textImageComponent};
};

export default useArabicInfractionTicketPrinter;
