import store from "store";

import * as ActionTypes from "../actions/actionTypes";
import * as LocalStorageConsts from "../LocalStorageConsts";

const defaultState = {
  setup:
    store.get(LocalStorageConsts.APP_SETUP) === undefined
      ? false
      : store.get(LocalStorageConsts.APP_SETUP),
  pending: store.get(LocalStorageConsts.APP_SETUP) === undefined,
  error: null
};

export const setupStatus = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_SETUP_STATUS: {
      return { ...state, setup: action.payload };
    }
    case ActionTypes.FETCH_SETUP_STATUS_PENDING: {
      return { ...state, pending: true };
    }
    case ActionTypes.FETCH_SETUP_STATUS_FULFILLED: {
      store.set(LocalStorageConsts.APP_SETUP, action.payload.data.setup);
      return { ...state, setup: action.payload.data.setup, pending: false };
    }
    case ActionTypes.FETCH_SETUP_STATUS_REJECTED: {
      return { ...state, error: action.payload.response.data.error };
    }
    case ActionTypes.UPDATE_SETUP_STATUS_PENDING: {
      return { ...state, error: null };
    }
    case ActionTypes.UPDATE_SETUP_STATUS_FULFILLED: {
      store.set(LocalStorageConsts.APP_SETUP, action.payload.data.setup);
      return { ...state, setup: action.payload.data.setup };
    }
    case ActionTypes.UPDATE_SETUP_STATUS_REJECTED: {
      return { ...state, error: action.payload.response.data.error };
    }
    default:
      return state;
  }
};
