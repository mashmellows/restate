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
* Uses the haversine formula to calculate distance between your position and filtered homes.
* Ref: https://en.wikipedia.org/wiki/Haversine_formula
* @param {reactReduxFirebase} = array that contains the home position (lat/long)
* @param {firebase} = array that contains the home position (lat/long)
* @param {fireDBConfig} = Object with home related data.
* @param {createStore} = array that contains the home position (lat/long)
*/

const createStoreWithFirebase = compose(reactReduxFirebase(firebase, fireDBConfig))(createStore);

/**
* @description
* rootReducer
* Uses the haversine formula to calculate distance between your position and filtered homes.
* Ref: https://en.wikipedia.org/wiki/Haversine_formula
*/

const rootReducer = combineReducers({
  firebase: firebaseReducer,
});

/**
* @description
* initialState
* Uses the haversine formula to calculate distance between your position and filtered homes.
* Ref: https://en.wikipedia.org/wiki/Haversine_formula
*/

const initialState = {};

/**
* @description
* store
* Uses the haversine formula to calculate distance between your position and filtered homes.
* Ref: https://en.wikipedia.org/wiki/Haversine_formula
* @param {rootReducer} = array that contains the home position (lat/long)
* @param {initialState} = Object with home related data.
*/

const store = createStoreWithFirebase(rootReducer, initialState);

/**
* @description
* App
* Uses the haversine formula to calculate distance between your position and filtered homes.
* Ref: https://en.wikipedia.org/wiki/Haversine_formula
*/

const App = () => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <LandingPage />
    </ApolloProvider>
  </Provider>
);

export default App;
