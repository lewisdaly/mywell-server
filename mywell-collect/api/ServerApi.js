// import Config from 'react-native-config';

import { rejectRequestWithError } from '../util';

const SERVER_URL = process.env.SERVER_URL;
const DONT_USE_ACCESS_TOKEN = process.env.DONT_USE_ACCESS_TOKEN;

const appendUrlParameters = (url, qs) => {
  let queryString = new URLSearchParams();
  for (let idx in Object.keys(qs)) {
    const key = Object.keys(qs)[idx];

    queryString.append(key, qs[key]);
  }

  return `${url}?${queryString.toString()}`;
}

class ServerApi {

  static submitReading({pincode, resourceId, date, value}) {

    console.log(pincode, resourceId, date, value);

    const baseUrl = `${SERVER_URL}/api/readings`;
    const url = appendUrlParameters(baseUrl, {access_token:DONT_USE_ACCESS_TOKEN});

    /* eg:
    {
      "date": "2017-12-12",
      "value": 0,
      "postcode": 0,
      "resourceId": 0,
    }
    */

    const data = JSON.stringify({
      date,
      value,
      resourceId,
      postcode: pincode
    });

    return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data
    })
    .then(response => {
      if (!response.ok) {
        console.log(response._bodyText);
        return rejectRequestWithError(response.status);
      }

      return response.json();
    })
    .then(body => {
      console.log(body);
    });
  }

  static checkResourceExists({pincode, resourceId}) {
    console.log('server_url ', SERVER_URL);

    const baseUrl = `${SERVER_URL}/api/resources`;

    //{"where":{"and": [{"postcode":313603}, {"id":1111}]}}
    const filter = JSON.stringify({
      where: {
        and: [
          {postcode: pincode},
          {id: resourceId},
        ]
      }
    });

    return fetch(appendUrlParameters(baseUrl, {filter}))
    .then(response => {
      //Resource exists, format the response
      if (!response.ok) {
        //TODO: should this be an error?
        return Promise.reject({status: response.status});
      }
      return response.json();
    })
    .then(body => {
      if (!body || !body[0]) {
        //Where filter found nothing
        return Promise.reject({status: 400});
      }

      const resource = body[0];
      //TODO: the server really should return these, but for now this will do.
      let formattedResponse = null;
      const defaultResponse = {
        resourceType: resource.type,
        resourceUnits: 'm',
        maxValue: null,
        minValue: null,
      };
      switch (resource.type) {
        case "well":
          formattedResponse = {
            ...defaultResponse,
            resourceReadingName: 'Depth to Water Level',
            maxValue: resource.well_depth,
          }
          break;
        case "checkdam":
          formattedResponse = {
            ...defaultResponse,
            resourceReadingName: 'Watertable Height',
          }

          break;
        case "raingauge":
          formattedResponse = {
            ...defaultResponse,
            resourceReadingName: 'Water column height',
            resourceUnits: 'mm',
          }
          break;
        default:
          return Promise.reject(new Error(`Unkown resource type: ${resource.type}`));
      }

      return formattedResponse;
    });
  }

  /**
   * Check if resource exists, returns the resourceType and resourceUnit
   * TODO: deal with max well depth?
   */
  static checkResourceExistsTest({pincode, resourceId}){

    //TODO: network
    return new Promise((resolve, reject) => {
      const data = {
        resourceType: 'well',
        resourceReadingName: 'Depth to Water Level',
        resourceUnits: 'm',
        maxValue: 100, //this will be the max well depth
        minValue: 0 //ground level for wells.
      };
      console.log("setTimeout");
      setTimeout(function(){
        console.log("timeout!");
        return resolve(data);
      }, 1 * 1000); //10s
    });

  }
}

export default ServerApi;
