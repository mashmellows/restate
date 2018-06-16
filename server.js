// imports
const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

// declaring express application
const app = express();

// GraphQL Registration, **DEVELOPMENT USE** ONLY
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}));

// change @const to change app port.
const port = 3000;

// listening on port
app.listen(port, () => {
  console.log('Zeus Active on Port ', port);
});
