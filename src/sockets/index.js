const socketio = require('socket.io')
const challonge = require('challonge')
const setupConfig = require('../../config.json')
const client = challonge.createClient({
  apiKey: setupConfig.apikey
})
let ALL_BRACKETTE_USERS = {}
let OPEN_MATCHES = {}
let ALL_PLAYERS_NAME = {}

let currentTournamentId

module.exports.listen = (app) => {
  const io = socketio.listen(app)
  io.sockets.on('connection', (socket) => {
    console.log('someone connected!', socket.id)
    socket.on('addUser', (brackette) => {
      brackette.id = socket.id
      ALL_BRACKETTE_USERS[socket.id] = brackette
      // Update the OPEN_MATCHES object if needed...
      if (isServer(brackette.id) && (((brackette.tournamentId !== currentTournamentId) && brackette.tournamentId) || Object.keys(OPEN_MATCHES).length === 0)) {
        // So...is we are a server AND the tournamentId has changed & we have a value or maybe all matches is empty...
        client.matches.index({
          id: brackette.tournamentId,
          state: 'open',
          callback: (err, data) => {
            console.log('request to challonge was made.')
            if (err) {
              socket.emit('tournamentIdErr', {message: 'There was an error with the tournament ID given...'})
              OPEN_MATCHES = {}
              return
            }
            currentTournamentId = brackette.tournamentId
            OPEN_MATCHES = data
            // Due to async, the OPEN matches could still be zero when we emit updateOpenMatches after updatesocket, thus not updating our front end.
            // So the first time we get our challonge response, we emit this.
            // The second time they go in or if they refresh, this call back will not get called, instead we emit the updateOpenMatches elsewhere.
            socket.emit('updateOpenMatches', OPEN_MATCHES)

            // after we get the matches, update the players
            client.participants.index({
              id: brackette.tournamentId,
              callback: (err, data) => {
                console.log('request to challonge was made.')
                if (err) {
                  socket.emit('tournamentIdErr', {message: 'There was an error with the tournament ID given...'})
                  ALL_PLAYERS_NAME = {}
                  return
                }
                // store ALL_PLAYERS to object by their id.
                for (const i in data) {
                  ALL_PLAYERS_NAME[data[i].participant.id] = data[i].participant.displayName
                }
                socket.emit('updatePlayersName', ALL_PLAYERS_NAME)
              }
            })
          }
        })
      }
      updateSockets()

      if (Object.keys(OPEN_MATCHES).length !== 0 && isServer(brackette.id)) {
        console.log("let's send data...")
        socket.emit('updateOpenMatches', OPEN_MATCHES)
      }
      if (Object.keys(ALL_PLAYERS_NAME).length !== 0 && isServer(brackette.id)) {
        console.log("let's send data...")
        socket.emit('updatePlayersName', ALL_PLAYERS_NAME)
      }
    })

    // update user will simply update the user...
    socket.on('updateUser', (brackette) => {
      console.log('server here. we gotta update the user!')
      ALL_BRACKETTE_USERS[brackette.id] = brackette
      updateSockets()
    })
    socket.on('resetEveryone', () => {
      OPEN_MATCHES = {}
      ALL_PLAYERS_NAME = {}
      currentTournamentId = undefined
      io.emit('reset')
    })

    socket.on('sendPrivateMatchDetails', (brackette) => {
      if (Object.keys(OPEN_MATCHES).length !== 0) {
          // here we would calculate the match! nice...
        io.to(brackette.specificBrackette.id).emit('receiveMatchDetails', brackette.specificMatch)
      } else {
        socket.emit('sendMatchDetailsError', {message: 'There are no open matches...'})
      }
        // NOTE: remove below, as it is for testing...
    })
    socket.on('sendMatchResults', (matchRes) => {
        // update match results
      client.matches.update({
        id: currentTournamentId,
        matchId: matchRes.match.matchId,
        match: {
          scoresCsv: matchRes.match.score,
          winnerId: matchRes.match.winnerid
        },
        callback: (err, data) => {
          if (err) {
            console.log('nope..')
            socket.emit('tournamentIdErr', {message: 'There was an error with the tournament ID given...'})
              // FIXME: Make these errors more specific :P
            return
          }
          console.log('we updated the match')
            // now we need to get the new set of open tournaments....
            // could this be it's own function I wonder...
          client.matches.index({
            id: currentTournamentId,
            state: 'open',
            callback: (err, data) => {
              console.log('request to challonge was made.')
              if (err) {
                socket.emit('tournamentIdErr', {message: 'There was an error with the tournament ID given...'})
                OPEN_MATCHES = {}
                return
              }
              OPEN_MATCHES = data
                // this emit will tell the server that it needs to update a few things...
              io.to(matchRes.server.id).emit('updateOpenMatches', OPEN_MATCHES)
              io.to(matchRes.server.id).emit('updateServerMatchDisplay')
            }
          })
        }
      })
    })

    socket.on('disconnect', () => {
      console.log('someone disconnected', socket.id)
      var bracketteUserThatLeft = ALL_BRACKETTE_USERS[socket.id]
      delete ALL_BRACKETTE_USERS[socket.id]
      updateSockets()
      // only problem with this is if they refresh a lot ...
      io.sockets.emit('someone_left', bracketteUserThatLeft)
    })

    function updateSockets () {
      io.sockets.emit('update', ALL_BRACKETTE_USERS)
    }

    function isServer (socketId) {
      return ALL_BRACKETTE_USERS[socketId].role === 'server'
    }
  })
}
