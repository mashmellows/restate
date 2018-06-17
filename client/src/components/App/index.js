/* eslint-disable */
import React, { Component } from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import LandingPage from './../Landing';

const client = new ApolloClient({});

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LandingPage />
      </ApolloProvider>
    )
  }
}
