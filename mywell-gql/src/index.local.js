import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'

import schema from './schema';

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
