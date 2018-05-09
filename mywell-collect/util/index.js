import { Alert } from 'react-native';


/**
 * Get a unique hash based on the resourceId, pincode, and date
 */
const getHashForReading = (reading) => {
  return `r:${reading.date}|${reading.resourceId}|${reading.pincode}`;
}

const rejectRequestWithError = (status) => {
  const error = new Error(`Request failed with status ${status}`);
  error.status = status;
  return Promise.reject(error);
}

const showAlert = (title, message) => {
  Alert.alert(title,message ,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    { cancelable: false }
  );
}

export {
  getHashForReading,
  rejectRequestWithError,
  showAlert
};
