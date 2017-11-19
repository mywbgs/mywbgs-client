import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'font-awesome/css/font-awesome.css';
import './index.css';

import store from './store';

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
registerServiceWorker();
