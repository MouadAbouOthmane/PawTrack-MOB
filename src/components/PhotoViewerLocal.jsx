import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import * as FileSystem from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

const PhotoViewerLocal = ({visible, photos, initialPhotoIndex, onClose}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const currentPhoto = photos[currentIndex];

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    setCurrentIndex(initialPhotoIndex);
  }, [initialPhotoIndex]);

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  };

  const downloadImage = async () => {
    // Check and request permission
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      ToastAndroid.show('Storage permission denied', ToastAndroid.SHORT);
      return;
    }

    try {
      // Generate unique filename
      const date = new Date();
      const timestamp = date.getTime();
      const fileName = `infraction_${timestamp}.jpg`;

      // Use FileSystem to copy the file
      const downloadsDir = FileSystem.DownloadDirectoryPath;
      const destinationPath = `${downloadsDir}/${fileName}`;

      // Copy the file
      await FileSystem.copyFile(currentPhoto, destinationPath);

      ToastAndroid.show('Image downloaded successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Download error:', error);
      ToastAndroid.show('Failed to download image', ToastAndroid.SHORT);
    }
  };

  const shareImage = async () => {
    try {
      // Use the local file path directly for sharing
      await Share.open({
        url: `file://${currentPhoto}`,
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />

        {/* Top toolbar */}
        <View style={styles.toolbar}>
          <IconButton
            icon="close"
            iconColor="white"
            size={26}
            onPress={onClose}
          />
          <View style={styles.toolbarRight}>
            <IconButton
              icon="share-variant"
              iconColor="white"
              size={26}
              onPress={shareImage}
            />
            <IconButton
              icon="download"
              iconColor="white"
              size={26}
              onPress={downloadImage}
            />
          </View>
        </View>

        {/* Navigation buttons */}
        <View style={styles.navigationContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.leftButton]}
              onPress={handlePrevious}>
              <IconButton icon="chevron-left" iconColor="white" size={40} />
            </TouchableOpacity>
          )}

          {currentIndex < photos.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.rightButton]}
              onPress={handleNext}>
              <IconButton icon="chevron-right" iconColor="white" size={40} />
            </TouchableOpacity>
          )}
        </View>

        {/* Main image */}
        <Image
          source={{uri: `file://${currentPhoto}`}}
          style={{
            width: windowWidth,
            height: windowHeight * 0.8,
            resizeMode: 'contain',
          }}
        />

        {/* Photo counter */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {photos.length}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  toolbarRight: {
    flexDirection: 'row',
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    zIndex: 3,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -25}],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 5,
    zIndex: 4,
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 2,
  },
});

export default PhotoViewerLocal;
