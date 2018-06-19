/* eslint-disable */
// imports.
import React from 'react';
import ReactDOM from 'react-dom';

// main App import.
import App from './src/components/App';

// Error Logging via sentry @https://sentry.io/
Raven.config('https://07394c529c3d4a80bf99c6c3a98b62cc@sentry.io/1228771').install()

// ReactDOM Render.
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
