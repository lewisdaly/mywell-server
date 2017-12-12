//TODO: load from env var
const MYWELL_HOST = 'http://192.168.99.100:3000'

class ServerApi {

  static checkResourceExists({pincode, resourceId}) {
    const url = `${MYWELL_HOST}/api/resources`

    //{"where":{"and": [{"postcode":313603}, {"id":1111}]}}
    const filter = encodeURIComponent({
      where: {
        and: [
          {postcode: pincode},
          {id: resourceId},
        ]
      }
    });
    const request = new Request(url, {method: 'GET', qs: {filter}});
    console.log("url is:", url);
    // const request = new Request(url);
    return fetch(request)
    .then(response => {
      //TODO: parse and format the body
      //Resource exists, format the response
      console.log('response', response);
      if (!response.ok) {
        return Promise.reject({statusCode: response.statusCode});
      }
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
