import React from "react";
import ReactDOM from "react-dom";
import * as Raven from "raven-js";
import App from "./App";
import ReactGA from "react-ga";
import registerServiceWorker from "./registerServiceWorker";
import "font-awesome/css/font-awesome.css";
import "./index.css";

import store from "./store";

ReactGA.initialize("UA-109842496-1");
Raven.config(
  "https://bcdf160b5c1647d8b4bd4de442eb74c4@sentry.io/247337"
).install();

Raven.context(function() {
  ReactDOM.render(<App store={store} />, document.getElementById("root"));
});

registerServiceWorker();
