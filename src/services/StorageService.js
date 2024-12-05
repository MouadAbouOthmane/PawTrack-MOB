import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Generic method to save data
  static async saveData(key, data) {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  // Generic method to retrieve data
  static async getData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  // Dog-specific methods
  static async saveDog(dog) {
    try {
      const existingDogs = await this.getAllDogs();
      const updatedDogs = [...existingDogs, dog];
      await this.saveData('dogs', updatedDogs);
    } catch (error) {
      console.error('Error saving dog:', error);
    }
  }

  static async getAllDogs() {
    return (await this.getData('dogs')) || [];
  }

  static async getDogById(id) {
    const dogs = await this.getAllDogs();
    return dogs.find(dog => dog.id === id) || null;
  }

  static async getDogByUhfTag(uhfTag) {
    const dogs = await this.getAllDogs();
    return dogs.find(dog => dog.uhf_tag === uhfTag) || null;
  }

  static async deleteDog(id) {
    const dogs = await this.getAllDogs();
    const updatedDogs = dogs.filter(dog => dog.id !== id);
    await this.saveData('dogs', updatedDogs);
  }

  // Event-specific methods
  static async saveEvent(event) {
    try {
      const existingEvents = await this.getAllEvents();
      const updatedEvents = [...existingEvents, event];
      await this.saveData('events', updatedEvents);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }

  static async getAllEvents() {
    return (await this.getData('events')) || [];
  }

  static async getEventsByDogId(dogId) {
    const events = await this.getAllEvents();
    console.log(events);
    return events.filter(event => event.dog_id === dogId);
  }

  // History-specific methods
  static async saveHistory(history) {
    try {
      const existingHistory = await this.getAllHistory();
      const updatedHistory = [...existingHistory, history];
      await this.saveData('history', updatedHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  static async getAllHistory() {
    return (await this.getData('history')) || [];
  }

  static async getHistoryByDogId(dogId) {
    const history = await this.getAllHistory();
    return history.filter(h => h.dog_id === dogId);
  }

  // Utility method to generate unique IDs
  static generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export {StorageService};
