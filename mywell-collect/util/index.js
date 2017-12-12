


/**
 * Get a unique hash based on the resourceId, pincode, and date
 */
const getHashForReading = (reading) => {
  return `r:${reading.date}|${reading.resourceId}|${reading.pincode}`;
}


export {
  getHashForReading
};
