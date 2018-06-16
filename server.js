// imports | require
const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const proxy = require('express-http-proxy');
const { spawn } = require('child_process');

// variable declaration
const API_URL = 'localhost:8000';
const API_REDIRECT = '/api/v1/';
const GRAPHQL_URL = '/graphql';
const ROOT_URL = '/';

// declaring express application
const app = express();

// declaring python script process spawner
const pythonProcess = spawn('python', ['./manage.py', 'runserver']);

// GraphQL Registration, **DEVELOPMENT USE** ONLY
app.use(GRAPHQL_URL, expressGraphQL({
  schema,
  graphiql: true,
}));

// Django REST Framework Process Start.
app.get(ROOT_URL, (req, res) => {
  app.use(API_REDIRECT, proxy(API_URL));
  res.redirect(API_REDIRECT);
  try {
    pythonProcess.stdout.on('data', (data) => {
      res.write(data);
      res.end('end');
    });
  } catch (error) {
    // DEVELOPMENT ONLY
    console.error('Django REST Framework: ', error);
  }
});

// change @const to change app port.
const port = 3000;

// listening on port
app.listen(port, () => {
  // DEVELOPMENT ONLY
  console.log('<Zeus V1> Active on Port ', port);
});
