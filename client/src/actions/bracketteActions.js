import * as ActionTypes from './actionTypes';
import db from '../db';

export function fetchBrackette() {
  return {
    type: ActionTypes.GET_BRACKETTE,
    payload: db.table('brackette').toArray()
  };
}

export function addBrackette(newBrackette) {
  return {
    type: ActionTypes.ADD_BRACKETTE,
    payload: db.table('brackette').add(newBrackette)
  };
}

export function updateBrackette(newBrackette) {
  return {
    type: ActionTypes.UPDATE_BRACKETTE,
    payload: db
      .table('brackette')
      .update(newBrackette.id, newBrackette)
      .then(() => { return db.table('brackette').get(newBrackette.id); })
  };
}

export function deleteBrackette(id) {
  return {
    type: ActionTypes.DELETE_BRACKETTE,
    payload: db.table('brackette').delete(id)
  };
}
