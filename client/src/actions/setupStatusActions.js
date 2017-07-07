import axios from "axios";
import store from "store";

import * as ActionTypes from "./actionTypes";
import * as LocalStorageConsts from "../LocalStorageConsts";

export function getSetupStatus() {
  return {
    type: ActionTypes.FETCH_SETUP_STATUS,
    payload:
      store.get(LocalStorageConsts.APP_SETUP) === undefined ||
      store.get(LocalStorageConsts.APP_SETUP) === false
        ? axios.get("/setup/setup-status")
        : store.get(LocalStorageConsts.APP_SETUP)
  };
}

export function updateSetupStatus(apikey) {
  return {
    type: ActionTypes.UPDATE_SETUP_STATUS,
    payload: axios.post("/setup", { apikey: apikey })
  };
}
