// imports | require
const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

// variable declaration
const GRAPHQL_URL = '/graphql';

// declaring express application
const app = express();

// GraphQL Registration, **DEVELOPMENT USE** ONLY
app.use(GRAPHQL_URL, expressGraphQL({
  schema,
  graphiql: true,
}));

const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;
