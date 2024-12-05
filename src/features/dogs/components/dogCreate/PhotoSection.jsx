import React, {useState} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import ImagePickerModal from '../../../infractions/components/CreateInfraction/ImagePickerModal';

const PhotoSection = ({photos, setPhotos, onPress}) => {
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const theme = useTheme();

  const handleImageSelected = selectedImages => {
    setPhotos(prev => [...prev, ...selectedImages]);
    setImagePickerVisible(false);
  };

  const removeImage = indexToRemove => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={() => {
          setImagePickerVisible(true);
          onPress();
        }}
        style={styles.addButton}
        icon="camera">
        Ajouter des photos
      </Button>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.photoScroll}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={photo} style={styles.photo} />
            <TouchableOpacity
              style={[
                styles.removePhotoButton,
                {backgroundColor: theme.colors.error},
              ]}
              onPress={() => removeImage(index)}>
              <Text style={styles.removePhotoText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <ImagePickerModal
        visible={imagePickerVisible}
        onDismiss={() => setImagePickerVisible(false)}
        onImageSelected={handleImageSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  addButton: {
    marginBottom: 8,
  },
  photoScroll: {
    marginTop: 8,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PhotoSection;
