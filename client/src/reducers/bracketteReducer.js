import _ from 'lodash';
import db from '../db';

import * as ActionTypes from '../actions/actionTypes';
import Brackette from '../Brackette';

export const brackette = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.GET_BRACKETTE_FULFILLED: {
      let newBrackette = _.cloneDeep(action.payload);
      if (_.isEmpty(newBrackette)) {
        // first time... create their brackette object and store it in db.
        newBrackette = new Brackette();
        db.table('brackette').add(newBrackette);
        return newBrackette;
      }
      return newBrackette[0];
    }
    case ActionTypes.UPDATE_BRACKETTE_FULFILLED: {
      let newBrackette = _.cloneDeep(action.payload);
      return newBrackette;
    }
    case ActionTypes.DELETE_BRACKETTE_FULFILLED: {
      window.location.reload();
      break;
    }
    default: return state;
  }
};
