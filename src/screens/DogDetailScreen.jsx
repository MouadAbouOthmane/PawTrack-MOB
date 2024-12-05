import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, Card, useTheme, Title, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDogTracking} from '../hooks/DogTrackingContext';
import HistoryModal from '../components/HistoryModal';
import {formatDateTime} from '../utils/date';
import PhotoViewerLocal from '../components/PhotoViewerLocal';
import Toast from 'react-native-toast-message';

const DogDetailScreen = ({route, navigation}) => {
  const {getDogDetailById, getDogEvents, getDogHistory, deleteDog} =
    useDogTracking();
  const {dogId} = route.params;
  const [dog, setDog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vaccineInfo, setVaccineInfo] = useState({
    vaccineDate: '',
    deparasitageDate: '',
    willNotHaveChildren: false,
  });
  const [dogHistory, setDogHistory] = useState([]);
  const theme = useTheme();
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [photoViewerConfig, setPhotoViewerConfig] = useState({
    visible: false,
    initialIndex: 0,
    photos: [],
  });

  const closePhotoViewer = () => {
    setPhotoViewerConfig(prev => ({...prev, visible: false}));
  };

  const openPhotoViewer = index => {
    setPhotoViewerConfig(prev => ({
      ...prev,
      visible: true,
      initialIndex: index,
    }));
  };

  const handleDeleteDog = async () => {
    Alert.alert(
      'Confirmation de suppression',
      'Voulez-vous vraiment supprimer ce chien ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDog(dogId); // Implement this method in your context/API

              // Show success toast
              Toast.show({
                type: 'success',
                text1: 'Chien supprimé',
                text2: 'Le chien a été supprimé avec succès',
                visibilityTime: 3000,
              });

              navigation.goBack(); // Return to the previous screen
            } catch (err) {
              // Show error toast
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible de supprimer le chien',
                visibilityTime: 3000,
              });
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    const fetchDogDetail = async () => {
      try {
        setIsLoading(true);
        const dogDetail = await getDogDetailById(dogId);

        // Check if dogDetail is null or undefined
        if (!dogDetail) {
          setError(new Error('Aucune information disponible pour ce chien'));
          setDog(null);
          return;
        }
        const events = await getDogEvents(dogId);
        const history = await getDogHistory(dogId);
        setDogHistory(
          history.sort(
            (a, b) => new Date(b.event_date) - new Date(a.event_date),
          ),
        );
        const willNoBeParent = events.some(
          e => e.type === 'Castration / Stérilisation',
        );
        setVaccineInfo(prev => ({
          ...prev,
          willNotHaveChildren: willNoBeParent,
          deparasitageDate:
            events.find(e => e.type === 'Déparasitage')?.date || '',
          vaccineDate:
            events
              .filter(e => e.type === 'Vaccination')
              .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date ||
            '',
        }));

        // Ensure photos array exists and has a default
        dogDetail.photos = dogDetail.photos || [];
        setPhotoViewerConfig(prev => ({...prev, photos: dogDetail.photos}));

        setDog(dogDetail);
        setError(null);
      } catch (err) {
        setError(err);
        setDog(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogDetail();
  }, [dogId, getDogDetailById, getDogEvents, getDogHistory]);

  // Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  // Render error state
  if (error || !dog) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorText}>
          {error?.message || 'Impossible de charger les informations du chien'}
        </Text>
        <Text style={styles.returnLink} onPress={() => navigation.goBack()}>
          Retour à la liste
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Card style={styles.card}>
        <Card.Cover
          source={{
            uri: dog.photos[0] || 'https://via.placeholder.com/300',
          }}
        />
        <Card.Content>
          <Text style={[styles.title, {color: theme.colors.primary}]}>
            Détails du chien
          </Text>

          {renderInfoSection(theme, 'tag', `Tag UHF: ${dog.uhf_tag || 'N/A'}`)}

          {renderInfoSection(
            theme,
            dog.gender === 'male' ? 'gender-male' : 'gender-female',
            `Sexe: ${dog.gender === 'male' ? 'Mâle' : 'Femelle'}`,
          )}

          {renderInfoSection(
            theme,
            'cake-variant',
            `Âge: ${dog.age || 'N/A'} ans`,
          )}

          {renderInfoSection(theme, 'dog', `Race: ${dog.race || 'N/A'}`)}

          {dog.found_location?.latitude &&
            renderInfoSection(
              theme,
              'map-marker',
              `Lieu trouvé:  ${dog.found_location.latitude.toFixed(
                4,
              )}, ${dog.found_location.longitude.toFixed(4)}`,
            )}

          {renderInfoSection(
            theme,
            'medical-bag',
            `Vaccination: ${formatDateTime(vaccineInfo.vaccineDate) || 'N/A'}`,
          )}

          {renderInfoSection(
            theme,
            'bug',
            `Dernier déparasitage: ${
              formatDateTime(vaccineInfo.deparasitageDate) || 'N/A'
            }`,
          )}

          {renderInfoSection(
            theme,
            'account-off',
            (dog.gender[0] === 'm' ? 'Castration: ' : 'Stérilisation: ') +
              (vaccineInfo.willNotHaveChildren ? 'Oui' : 'Non'),
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate('ActionSelection', {
            dogId: dog.id,
            willNotBeParent: vaccineInfo.willNotHaveChildren,
          })
        }
        style={styles.actionButton}
        icon="clipboard-list">
        Ajouter une action
      </Button>
      <Button
        mode="contained"
        onPress={() => setHistoryModalVisible(true)}
        style={styles.historyButton}
        icon="history">
        Voir l'historique
      </Button>
      <Button
        mode="contained"
        onPress={() => handleDeleteDog()} // You'd need to implement this function
        style={[
          styles.actionButton,
          styles.deleteButton,
          {backgroundColor: theme.colors.error},
        ]}
        color={theme.colors.error}
        icon="delete">
        Supprimer le chien
      </Button>

      {photoViewerConfig.photos.length > 0 && (
        <View style={styles.photoSection}>
          <Title style={styles.sectionTitle}>Photos</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.photoGrid}>
              {photoViewerConfig.photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openPhotoViewer(index)}
                  style={styles.photoWrapper}>
                  <Image source={{uri: photo}} style={styles.photo} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <PhotoViewerLocal
        visible={photoViewerConfig.visible}
        photos={photoViewerConfig.photos}
        initialPhotoIndex={photoViewerConfig.initialIndex}
        onClose={closePhotoViewer}
      />

      <HistoryModal
        visible={historyModalVisible}
        onDismiss={() => setHistoryModalVisible(false)}
        history={dogHistory}
      />
    </ScrollView>
  );
};

// Helper function to render info sections with consistent styling
const renderInfoSection = (theme, iconName, text) => (
  <View style={styles.infoSection}>
    <Icon name={iconName} size={24} color={theme.colors.primary} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: 'red',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  returnLink: {
    marginTop: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },

  photoSection: {
    padding: 16,
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  photoWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },

  actionButton: {
    marginBottom: 16,
  },

  deleteButton: {
    marginTop: 16,
  },
});

export default DogDetailScreen;
