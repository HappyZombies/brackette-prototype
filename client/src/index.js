import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from "react-redux";

import "./index.css";
import App from "./components/App";
import store from "./store";
import registerServiceWorker from "./registerServiceWorker";

injectTapEventPlugin();
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
