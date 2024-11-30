// src/features/infractions/components/InfractionDetail/styles.js
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    elevation: 0,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    margin: 16,
    elevation: 2,
    borderRadius: 12,
  },
  detailsSection: {
    gap: 16,
    marginTop: 24,
  },
  descriptionSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 8,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  secondaryButtonLabel: {
    fontSize: 16,
  },
  photoSection: {
    padding: 16,
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
});
