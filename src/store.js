import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import * as api from './api';
import * as reducers from './reducers';

import { downloadAll } from './actions';

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(
        thunk.withExtraArgument(api),
        logger,
    ),
    autoRehydrate()
);

persistStore(store, {
    whitelist: ['datastore']
}, () => {
    if(store.getState().datastore.authToken) {
        store.dispatch(downloadAll());
    }
});

export default store;