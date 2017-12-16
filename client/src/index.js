// no need to specify relative path. if not specified, going to pick up from npm modules
import 'materialize-css/dist/css/materialize.min.css';

// very initial data layer control (REDUX)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk'; // action creater

import App from './components/App';
import reducers from './reducers';

// Testing Mailer.js
//import axios from 'axios';
//window.axios = axios;

// create new instance of redux store; helper function (reducers, initial state, middleware)
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

// provider tag, start store, <App> will get effected (child of provider)
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.querySelector('#root')
); //root componenet, site to render DOM node
