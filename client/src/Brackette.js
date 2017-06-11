/**
 * The Brackette Object is the data on what the user is.
 * This data is the one stored in local storage and is the state
 */
import shortid from 'shortid'

export default class Brackette {
  constructor() {
    this.allBrackettes = {}
    this.allChallongePlayersName = {}
    this.allOpenMatches = {}
    this.currentMatch = {}
    this.currentTournamentId = ''
    this.id = shortid.generate() // an actual unique id.
    this.inprogress = false // Note: A match won't be in progress, a user will be in progress!
    this.isSetup = false // whether the user has set their role and name etc from the modal.
    this.name = ''
    this.role = ''
    this.socketId = 0 // this id can change cuz it's from the socket
    this.subdomain = ''
  }
}
