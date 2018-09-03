import { createStore, applyMiddleware, combineReducers } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";

import * as api from "./api";
import * as reducers from "./reducers";

import { downloadAll, logout } from "./actions";

const middleware = [
  thunk.withExtraArgument(api),
  process.env.NODE_ENV !== "production" && logger
].filter(x => !!x);

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(...middleware),
  autoRehydrate()
);

persistStore(
  store,
  {
    whitelist: ["datastore"]
  },
  () => {
    const token = store.getState().datastore.authToken;
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken["iat"] < 1535972955) {
        store.dispatch(logout());
      } else {
        store.dispatch(downloadAll());
      }
    }
  }
);

if (process.env.NODE_ENV !== "production") {
  window._store = store;
}

export default store;
