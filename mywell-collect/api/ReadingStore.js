import { AsyncStorage } from 'react-native';

import { getHashForReading } from '../util';

const SAVED_READINGS_KEY = "SAVED_READINGS";

class ReadingStore {

  static getSavedReadings() {
    return AsyncStorage.getItem(SAVED_READINGS_KEY)
    .then(readings => {
      if (readings === null || typeof readings === undefined) {
        return AsyncStorage.setItem(SAVED_READINGS_KEY, JSON.stringify({}))
        .then(() => {});
      }

      return JSON.parse(readings);
    })
    .catch(err => {
      console.log(err);
    });
  }

  static pushSavedReading(reading) {
    return this.getSavedReadings()
    .then(readings => {
      readings[getHashForReading(reading)] = reading;

      return AsyncStorage.setItem(SAVED_READINGS_KEY, JSON.stringify(readings));
    })
    .then(() => this.getSavedReadings())
    .catch(err => {
      console.log(err);
    });
  }

  static removeSavedReading(readingHash) {
    return this.getSavedReadings()
    .then(readings => {
      delete readings[readingHash];

      return AsyncStorage.setItem(SAVED_READINGS_KEY, JSON.stringify(readings));
    });
  }
}

export default ReadingStore;
