import resolvers from './resolvers';

const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

const typeDefs = `
  scalar DateTime
  scalar Geo

  type Resource {
    id: ID!
    resourceId: Int!
    lastValue: Float
    wellDepth: Float
    lastDate: DateTime
    owner: String!
    elevation: Int
    type: String!
    postcode: Int!
    lat: Float!
    lng: Float!
    clientId: Int
  }

  type Client {
    id: ID! @isUnique
    mobileNumber: String
    username: String!
    email: String
    created: DateTime
    lastUpdated: DateTime
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
    resources: [Resource]
    clients: [Client]
    resource(postcode: Int, resourceId: Int): Resource
    client(id: Int): Client
    readings(postcode: Int, resourceId: Int): [Reading]
    weeklyReadings(postcode: Int, resourceId: Int, sumOrAvg: String, startDate: DateTime, endDate: DateTime): [WeeklyReading]
    cumulativeWeeklyReadings(postcode: Int, resourceId: Int, startDate: DateTime, endDate: DateTime): [WeeklyReading]
  }
`;

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
