import React from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import LandingPage from './../Landing';

const client = new ApolloClient({});

const App = () => (
  <ApolloProvider client={client}>
    <LandingPage />
  </ApolloProvider>
);

export default App;

// Statefull version of the export.
// export default class App extends Component {
//   render() {
//     return (
//       <ApolloProvider client={client}>
//         <LandingPage />
//       </ApolloProvider>
//     )
//   }
// }
