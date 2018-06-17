const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,

} = graphql;

const AgencyType = new GraphQLObjectType({
  name: 'Agency',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    logo: { type: GraphQLString },
  },
});

const HomeType = new GraphQLObjectType({
  name: 'Home',
  fields: {
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
    agencyId: {
      type: AgencyType,
      resolve(parentValue) {
        return axios.get(`http://localhost:8000/agency/${parentValue.agencyId}/`)
          .then(res => res.data);
      },
    },
    price: { type: GraphQLString },
    // agent: {
    //   type: AgencyType,
    //   resolve(parentValue) {
    //     return axios.get(`http://localhost:8000/agent/${parentValue.agentId}/`)
    //       .then(res => res.data);
    //   },
    // },
  },
});

// const AgentType = new GraphQLObjectType({
//   name: 'Agent',
//   fields: {
//     id: { type: GraphQLString },
//     firstName: { type: GraphQLString },
//     lastName: { type: GraphQLString },
//     email: { type: GraphQLString },
//     phoneNumber: { type: GraphQLString },
//     agency: { type: GraphQLString },
//     picture: { type: GraphQLString },
//     age: { type: GraphQLInt },
//     agencyId: {
//       type: AgencyType,
//       resolve(parentValue) {
//         return axios.get(`http://localhost:8000/agency/${parentValue.agencyId}/`)
//           .then(res => res.data);
//       },
//   },
// });

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    home: {
      type: HomeType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:8000/homes/${args.id}/`)
          .then(res => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
