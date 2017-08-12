import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
const  mysql = require('mysql2/promise');

import schema from './schema';

const PORT = process.env.PORT;
const app = express();

export const init = async () => {

  //https://medium.com/the-ideal-system/graphql-and-mongodb-a-quick-example-34643e637e49
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  //Simple keep alive
  setInterval(function () {
      connection.query('SELECT 1');
  }, 5000);

  app.get('/', async function(req, res) {
    res.send("Hello graphql");
  });

  /* middleware to prevent CORS errors */
  app.use("/graphql", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema, context: {connection:connection}}));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));

  app.listen(PORT, function() {
    console.log("server listening on port " + PORT);
  });

}

init();
