import React from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { createStore, combineReducers, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import firebase from 'firebase';
import * as config from '../../stores/config';
import LandingPage from './../Landing';

/**
* @description
* client
* Setting up ApolloClient to talk with the backend GraphQL service.
*/

const client = new ApolloClient({});

/**
* @description
* initializeApp()
* firebase initializing by using the given key from firebase.
* @param {config.FIREBASE_KEY} = Object containing all the data including the key.
*/

firebase.initializeApp(config.FIREBASE_KEY);

/**
* @description
* fireDBConfig
* Creating users in the firebase Database (Realtime DB)
* Use => useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
*/

const fireDBConfig = {
  userProfile: 'users',
};

/**
* @description
* createStoreWithFirebase
*
*
* @param {reactReduxFirebase} =
* @param {firebase} =
* @param {fireDBConfig} =
* @param {createStore} =
*/

const createStoreWithFirebase = compose(reactReduxFirebase(firebase, fireDBConfig))(createStore);

/**
* @description @todo
*
*
*/

const rootReducer = combineReducers({
  firebase: firebaseReducer,
});

/**
* @description @todo
*
*
*/

const initialState = {};

/**
* @description @todo
*
*
*/

const store = createStoreWithFirebase(rootReducer, initialState);

/**
* @description @todo
*
*
*/

const App = () => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <LandingPage />
    </ApolloProvider>
  </Provider>
);

export default App;
