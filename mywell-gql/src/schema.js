import resolvers from './resolvers';

const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

const typeDefs = `
  scalar DateTime

  type Resource {
    id: ID!
    last_value: Float!
    owner: String!
    postcode: Int!
  }

  type Reading {
    id: ID! @isUnique
    date: DateTime!
    value: Float!
    villageId: Int!
    postcode: Int!
    resourceId: Int!
  }

  type WeeklyReading {
    week: DateTime!
    value: Float
  }

  type Query {
    resource(postcode: Int, resourceId: Int): Resource
    readings(postcode: Int, resourceId: Int): [Reading]
    weeklyReadings(postcode: Int, resourceId: Int, sumOrAvg: String, startDate: DateTime, endDate: DateTime): [WeeklyReading]
    cumulativeWeeklyReadings(postcode: Int, resourceId: Int, startDate: DateTime, endDate: DateTime): [WeeklyReading]
  }

`;

/* Test data */
const posts = [
  { id: 1, imageUrl: 1, description: 'MyWel!'},
  { id: 2, imageUrl: 2, description: 'Welcome to Meteor'},
  { id: 3, imageUrl: 2, description: 'Advanced GraphQL'},
  { id: 4, imageUrl: 3, description: 'Launchpad is Cool'},
];

console.log("resolvers", resolvers);

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
