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
    if(process.env.NODE_ENV === 'production') {
        const state = store.getState();
        if(state.datastore && state.datastore.profile && state.datastore.profile.username) {
            const {username, email, form} = state.datastore.profile;
            Raven.setUserContext({
                username,
                email,
                year: form ? form.substring(0, form.length - 1) : null
            });
        }
        Raven.captureException(err);
        Raven.showReportDialog();
        console.log('Error logged to Sentry');
    } else {
        throw err;
    }
}
registerServiceWorker();
