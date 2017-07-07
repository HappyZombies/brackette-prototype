const socketio = require('socket.io');
const challonge = require('challonge');
const fs = require('fs');
const _ = require('lodash');
let setupConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config.json'));
let challongeClient = challonge.createClient({
  apiKey: setupConfig.apikey
});
let ALL_BRACKETTES = {};
let OPEN_MATCHES = {};
let ALL_PLAYERS_NAME = {};
let tournamentId = "";

// Listen for changes incase setupConfig changes (on first setup or reset)
fs.watch(process.cwd() + '/config.json', () => {
  setupConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config.json'));
  challongeClient = challonge.createClient({
    apiKey: setupConfig.apikey
  });
});

module.exports.listen = (app) => {
  const io = socketio.listen(app);
  io.sockets.on('connection', (socket) => {
    // see if they are ready to send us data...
    socket.on('add brackette', (brackette) => {
      console.log('brackette user connected -> ', brackette.name);
      let _brackette = _.clone(brackette);
      _brackette.socketId = socket.id;
      _brackette.allBrackettes = {};
      ALL_BRACKETTES[socket.id] = _brackette;
      const adjustedTournamentId = _brackette.subdomain ? _brackette.subdomain + "-" + _brackette.tournamentId : _brackette.tournamentId;
      if (isHost(_brackette.socketId) && ((adjustedTournamentId !== tournamentId) || Object.keys(OPEN_MATCHES).length === 0)) {
        // if this dude is a server, get the matches.
        console.log('Going to attempt to get tournament...');
        challongeClient.matches.index({
          id: adjustedTournamentId,
          state: 'open',
          callback: (err, data) => {
            if (err || !_brackette.tournamentId) {
              console.log(err);
              socket.emit('brackette error', { message: err ? err.text : "No tournament id is specified." });
              OPEN_MATCHES = {};
              ALL_PLAYERS_NAME = {};
              return;
            }
            tournamentId = adjustedTournamentId;
            if (_.isEmpty(data)) {
              socket.emit('brackette error', { message: "There are no open tournaments..." });
              return;
            }
            OPEN_MATCHES = _.cloneDeep(data);
            console.log('Matches received, going to send them to the host device.');
            socket.emit('receive matches', OPEN_MATCHES);
            // now get the all players names...
            console.log('Now going to retrieve the players names.');
            challongeClient.participants.index({
              id: adjustedTournamentId,
              callback: (err, data) => {
                if (err) {
                  console.log(err);
                  OPEN_MATCHES = {};
                  ALL_PLAYERS_NAME = {};
                  socket.emit('brackette error', { message: err.text });
                  return;
                }
                //if there is data already here, reset it.
                if (Object.keys(ALL_PLAYERS_NAME).length !== 0) {
                  ALL_PLAYERS_NAME = {};
                }
                // store ALL_PLAYERS to object by their player id.
                for (const i in data) {
                  ALL_PLAYERS_NAME[data[i].participant.id] = data[i].participant.displayName;
                }
                console.log('Players names received, sending them to the host device.');
                socket.emit('receive players names', ALL_PLAYERS_NAME);
              }
            });
          }
        });
      }
      io.sockets.emit('update brackettes', ALL_BRACKETTES); // tells every connected user
    });
    socket.on('send private match details', (matchDetails) => {
      console.log('Going to send a specific match to a client device.');
      if (Object.keys(OPEN_MATCHES).length !== 0) {
        // here we would calculate the match! nice...
        io.to(matchDetails.socketId).emit('receive match details', matchDetails.specificMatch);
      } else {
        console.log('There are no open matches to send... did the tournament end? Or is there an error ? ');
        socket.emit('brackette error', { message: 'There are no open matches...did the tournament end ?' });
      }
    });
    socket.on('send match results', (matchRes) => {
      console.log('Going to submit match results.');
      challongeClient.matches.update({
        id: tournamentId,
        matchId: matchRes.match.matchId,
        match: {
          scoresCsv: matchRes.match.score,
          winnerId: matchRes.match.winnerId
        },
        callback: (err) => {
          if (err) {
            console.log('Error sending match results.');
            console.dir(err);
            socket.emit('brackette error', { message: err.text });
            return;
          }
          // now we need to get the new set of open tournaments....
          // could this be it's own function I wonder...
          console.log('Match results submitted succesfully, now going to get the new list of open matches.');
          challongeClient.matches.index({
            id: tournamentId,
            state: 'open',
            callback: (err, data) => {
              if (err) {
                console.dir("Error retrieving the updated list of open matches from Challonge.");
                socket.emit('brackette error', { message: err.text });
                OPEN_MATCHES = {};
                return;
              }
              console.log('Succesfully obtained a list of open matches...sending them now');
              OPEN_MATCHES = data;
              const hostToSend = _.find(ALL_BRACKETTES, function (brack) {
                return brack.role === 'host';
              });
              // this emit will tell the server that it needs to update a few things...
              io.to(hostToSend.socketId).emit('matches updated', OPEN_MATCHES);
            }
          });
        }
      });
    });
    socket.on('disconnect', () => {
      try {
        console.log('brackette user disconnected -> ', ALL_BRACKETTES[socket.id].name);
      } catch (error) {
        console.log('someone disconnected -> ', socket.id);
      }
      delete ALL_BRACKETTES[socket.id];
      io.sockets.emit('update brackettes', ALL_BRACKETTES); // tell every connected user
    });
  });

  function isHost(socketId) {
    return ALL_BRACKETTES[socketId].role === 'host';
  }
};
