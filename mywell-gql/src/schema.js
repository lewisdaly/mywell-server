const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

const typeDefs = `
  type Post {
    description: String!
    id: ID! @isUnique
    imageUrl: String!
  }

  type Query {
    posts: [Post]
  }
`;

/* Test data */
const posts = [
  { id: 1, imageUrl: 1, description: 'Introduction to GraphQL'},
  { id: 2, imageUrl: 2, description: 'Welcome to Meteor'},
  { id: 3, imageUrl: 2, description: 'Advanced GraphQL'},
  { id: 4, imageUrl: 3, description: 'Launchpad is Cool'},
];

//TODO: we need to set this up with MySQL and/or MyWell Server
const resolvers = {
  Query: {
    posts: () => posts,
  },
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
