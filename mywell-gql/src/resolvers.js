import { ReadingModel } from './models'

const resolvers = {
  Query: {
    resource(root, args) {
      return { id:1, last_value: 10.11, owner: 'Lewis Ji', postcode: 5063 }
    },
    readings(root, args) {
      return [
        {id:1, date: "12345", value: 10.10, villageId:11, postcode:5063, resourceId: 1111},
        {id:2, date: "12345", value: 10.10, villageId:11, postcode:5063, resourceId: 1111}
      ];
      // ReadingModel.findByPostcodeAndResourceId(context, postcode, resourceId)
    }
  },
};

export default resolvers;
