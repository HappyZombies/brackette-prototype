import Dexie from 'dexie';

const db = new Dexie('BracketteDB');
db.version(1).stores({ brackette: 'id, tournamentid, role, name, error, inprogress, isSetup, subdomain' });

export default db;
