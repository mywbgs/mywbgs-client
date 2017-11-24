import React from 'react';
import ReactDOM from 'react-dom';
import * as Raven from 'raven';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'font-awesome/css/font-awesome.css';
import './index.css';

import store from './store';

try {
    ReactDOM.render(<App store={store}/>, document.getElementById('root'));
} catch(err) {
    const state = store.getState();
    Raven.setUserContext({
        username: state.datastore.profile.username,
        email: state.datastore.profile.email
    });
    Raven.captureException(err);
    Raven.showReportDialog();
}
registerServiceWorker();
