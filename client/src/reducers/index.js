import { combineReducers } from 'redux';

import { setupStatus } from './setupStatusReducer';
import { brackette } from './bracketteReducer';

export default combineReducers({
  setupStatus,
  brackette
});
