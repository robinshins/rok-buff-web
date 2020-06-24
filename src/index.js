import 'react-app-polyfill/ie9' //ie9~
import 'react-app-polyfill/ie11' //ie9~
import 'react-app-polyfill/stable';
import 'core-js/stable'
import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import './lang/i18n';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import reducers from './reducers';
import { Provider } from 'react-redux';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(reducers);



const render = ()=> {
  ReactDOM.render(
    <Provider store={store}>
    <App />
</Provider>,
      document.getElementById('root')
  );
};
store.subscribe(render);
render();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
