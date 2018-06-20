import React from 'react';
import ReactDOM from 'react-dom';
import App from './../client/src/components/App/';

/**
* @description
* See if the the App module successfully mounts within the DOM.
* @param {App} - React Component
* @return {passed} - If the component successfully mounts without crashing.
* @return {failed} - If the component failed to mount without crashing.
*/

describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
    });
});
