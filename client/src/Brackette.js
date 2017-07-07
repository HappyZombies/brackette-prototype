/**
 * The Brackette Object is the data on what the user is and contains all of their information.
 */
import shortid from "shortid";

export default class Brackette {
  constructor() {
    /**
     * An array of all the Brackette Users.
     * The property will be the socket id that is given to them upon connection.
     * The value will be a Brackette Object type.
     * @example {235dfasdf364: Brackette()}
     */
    this.allBrackettes = {};

    /**
     * For hosts:
     *  An object of all the challonge players retrieved from the tournament id.
     *  The property will be the player id and the value of those properties will be the actual name of the player.
     * For clients:
     *  null value,
     * @example - {23425345234: "DeeJay"}
     */
    this.allChallongePlayersName = null;

    /**
     * For hosts:
     *  An object of all the open challonge matches based on the tournament id.
     *  The properties of this object are the openmatches id given by challonge.
     * For clients:
     *  null value
     * @example - {23421324: {}}
     */
    this.allOpenMatches = null;

    this.error = null;
    /**
     * For clients:
     *  The individual/current match that they are handling/displaying
     * For hosts:
     *  null value as hosts don't display individual matches.
     */
    this.currentMatch = {};

    /**
     * For hosts:
     *  The tournament id that they specify.
     * For clients:
     *  null value as clients don't care about tournament ids.
     */
    this.tournamentId = "";

    /**
     * A unique id that will never change unless local storage is deleted.
     */
    this.id = shortid.generate(); // an actual unique id.

    /**
     * For clients:
     *  whether or not a client is handling a match at the moment or not.
     * TODO: Could we just check the value of currentMatch instead ?
     */
    this.inprogress = false;

    /**
     * Whether the user has set their role and name etc from the modal.
     */
    this.isSetup = false;

    /**
     * The name they specify. We recommend calling hosts 'Main Hosts/ Host 2'
     * And clients "Setup 1, 2 etc."
     */
    this.name = "";

    /**
     * What role this user is going to be. Only two values should be allowed
     * client or host
     * TODO: How do we enforce this ?
     */
    this.role = "";

    /**
     * The socketid that is given to us upon connection.
     * If the user refreshes or leaves and comes back, they will get a brand new socketid
     */
    this.socketId = 0;

    /**
     * For hosts, the subdomain that will be used incase their tournament contains a subdomain
     */
    this.subdomain = "";
  }
}
