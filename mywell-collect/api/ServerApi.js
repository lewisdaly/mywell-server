//TODO: load from env var
import Config from 'react-native-config';

const SERVER_URL = Config.SERVER_URL;

const appendUrlParameters = (url, qs) => {
  let queryString = new URLSearchParams();
  for (let idx in Object.keys(qs)) {
    const key = Object.keys(qs)[idx];

    queryString.append(key, qs[key]);
  }

  return `${url}?${queryString.toString()}`;
}

class ServerApi {

  static checkResourceExists({pincode, resourceId}) {
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
