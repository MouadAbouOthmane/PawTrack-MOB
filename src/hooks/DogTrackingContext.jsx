import React, {createContext, useContext, useState, useEffect} from 'react';
import {StorageService} from '../services/StorageService';

const DogTrackingContext = createContext(undefined);

export const DogTrackingProvider = ({children}) => {
  const [dogs, setDogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [history, setHistory] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const fetchedDogs = await StorageService.getAllDogs();
      const fetchedEvents = await StorageService.getAllEvents();
      const fetchedHistory = await StorageService.getAllHistory();

      setDogs(fetchedDogs);
      setEvents(fetchedEvents);
      setHistory(fetchedHistory);
    };

    loadInitialData();
  }, []);

  const addDog = async dogData => {
    const newDog = {
      ...dogData,
      id: StorageService.generateId(),
    };
    await StorageService.saveDog(newDog);
    setDogs(prev => [...prev, newDog]);
    return newDog;
  };

  const addEvent = async eventData => {
    const newEvent = {
      ...eventData,
      id: StorageService.generateId(),
    };
    await StorageService.saveEvent(newEvent);
    setEvents(prev => [...prev, newEvent]);
  };

  const addHistory = async historyData => {
    const newHistory = {
      ...historyData,
      id: StorageService.generateId(),
    };
    await StorageService.saveHistory(newHistory);
    setHistory(prev => [...prev, newHistory]);
  };

  const getDogEvents = async dogId => {
    return await StorageService.getEventsByDogId(dogId);
  };

  const getDogHistory = async dogId => {
    return await StorageService.getHistoryByDogId(dogId);
  };

  const getDogDetailById = async dogId => {
    return await StorageService.getDogById(dogId);
  };

  const getDogDetailByUhfTag = async uhfTag => {
    return await StorageService.getDogByUhfTag(uhfTag);
  };

  const deleteDog = async dogId => {
    await StorageService.deleteDog(dogId);
    setDogs(prev => prev.filter(dog => dog.id !== dogId));
  };

  return (
    <DogTrackingContext.Provider
      value={{
        dogs,
        events,
        history,
        addDog,
        addEvent,
        addHistory,
        getDogEvents,
        getDogHistory,
        getDogDetailById,
        getDogDetailByUhfTag,
        deleteDog,
      }}>
      {children}
    </DogTrackingContext.Provider>
  );
};

// Custom hook to use the DogTracking context
export const useDogTracking = () => {
  const context = useContext(DogTrackingContext);
  if (context === undefined) {
    throw new Error('useDogTracking must be used within a DogTrackingProvider');
  }
  return context;
};
