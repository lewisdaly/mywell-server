
const express = require('express');
const bodyParser = require('body-parser');
const apolloServerExpress = require('apollo-server-express')
const graphqlExpress = apolloServerExpress.graphqlExpress;
const graphiqlExpress = apolloServerExpress.graphiqlExpress;

const schema = require('./schema');

const PORT = process.env.PORT;
const app = express();

app.get('/', function(req, res) {
  res.send("Hello graphql");
});

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(PORT, function() {
  console.log("server listening on port " + PORT);
});
