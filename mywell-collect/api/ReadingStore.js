import { AsyncStorage } from 'react-native';

const SAVED_READINGS_KEY = "SAVED_READINGS";

class ReadingStore {

  static getSavedReadings() {
    return AsyncStorage.getItem(SAVED_READINGS_KEY)
    .then(readings => {
      if (readings === null || typeof readings === undefined) {
        return AsyncStorage.setItem(SAVED_READINGS_KEY, JSON.stringify([]))
        .then(() => []);
      }

      return JSON.parse(readings);
    });
  }

  static pushSavedReading(reading) {
    return this.getSavedReadings()
    .then(readings => {
      readings.push(reading);

      return AsyncStorage.setItem(SAVED_READINGS_KEY, JSON.stringify(readings));
    });
  }

  static removeSavedReading(idx) {
    return this.getSavedReadings()
    .then(readings => {
      delete readings[idx];

      return AsyncStorage.setItem(SAVED_READINGS_KEY, JSON.stringify(readings));
    });
  }
}

export default ReadingStore;
