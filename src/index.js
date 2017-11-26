import React from 'react';
import ReactDOM from 'react-dom';
import * as Raven from 'raven-js';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'font-awesome/css/font-awesome.css';
import './index.css';

import store from './store';

if(process.env.NODE_ENV === 'production') {
    Raven.config('https://bcdf160b5c1647d8b4bd4de442eb74c4@sentry.io/247337').install();
}

Raven.context(function() {
    ReactDOM.render(<App store={store}/>, document.getElementById('root'));
});

    
registerServiceWorker();
