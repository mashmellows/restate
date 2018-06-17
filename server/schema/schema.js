// imports | require
const graphql = require('graphql');
const axios = require('axios');

// destructuring graphQL
const {
  GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList,
} = graphql;

// declaring variables

// creating Agency GraphQL Object
const AgencyType = new GraphQLObjectType({
  name: 'Agency',
  // declaring the fields.
  // ES6 arrow function required due to awaiting on data.
  // refer to @ http://localhost:8000/agency/
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    logo: { type: GraphQLString },
    // home object need to be refered to the HomeType Object.
    homes: {
      // eslint-disable-next-line no-use-before-define
      type: new GraphQLList(HomeType),
      // main resolve function that returns the requested graphQL data.
      resolve(parentValue) {
        // Using Axios instead of fetch due to it's simplicity and better functionality
        // using django-url-filter to filter out data in the RESTFul service.
        return axios.get(`http://localhost:8000/homes/?agencyId=${parentValue.id}`)
          // breaking down the response since axios returns a pre-contained response.
          .then(res => res.data);
      },
    },
  }),
});

// creating Home GraphQL Object
const HomeType = new GraphQLObjectType({
  name: 'Home',
  // declaring the fields.
  // ES6 arrow function required due to awaiting on data.
  // refer to @ http://localhost:8000/homes/
  fields: () => ({
    id: { type: GraphQLInt },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    description: { type: GraphQLString },
    rooms: { type: GraphQLInt },
    bathrooms: { type: GraphQLInt },
    propertyType: { type: GraphQLString },
    latitude: { type: GraphQLString },
    longitude: { type: GraphQLString },
    picture: { type: GraphQLString },
    // agencyId object need to be refered to the AgencyType Object.
    agencyId: {
      type: AgencyType,
      // main resolve function that returns the requested graphQL data.
      resolve(parentValue) {
        return axios.get(`http://localhost:8000/agency/${parentValue.agencyId}/`)
          .then(res => res.data);
      },
    },
    price: { type: GraphQLString },
  }),
});

// defining the root query for graphQL as a starting point.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    // declaring RootQuery for the home object. using the id as args
    // example: home(id: <homeId>)
    home: {
      type: HomeType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:8000/homes/${args.id}/`)
          .then(res => res.data);
      },
    },
    // declaring RootQuery for the agency object. using the id as args
    // example: agency(id: <agencyId>)
    agency: {
      type: AgencyType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:8000/agency/${args.id}/`)
          .then(res => res.data);
      },
    },
    homes: {
      type: new GraphQLList(HomeType),
      resolve() {
        return axios.get('http://localhost:8000/homes/')
          .then(res => res.data);
      },
    },
  }),
});

// exports
module.exports = new GraphQLSchema({
  query: RootQuery,
});
