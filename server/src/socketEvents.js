const socketio = require('socket.io')
const challonge = require('challonge')
const fs = require('fs')
const setupConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config.json'))
const challongeClient = challonge.createClient({
  apiKey: setupConfig.apikey
})

let ALL_BRACKETTES = {}
let OPEN_MATCHES = {}
let ALL_PLAYERS_NAME = {}
let currentTournamentId

module.exports.listen = (app) => {
  const io = socketio.listen(app)
  io.sockets.on('connection', (socket) => {
    console.log('someone connected ', socket.id)
    socket.on('add brackette', (brackette) => {
      // The brackette user is setup, let's add them to our object here.
      brackette.socketId = socket.id
      ALL_BRACKETTES[socket.id] = brackette
      if (isHost(brackette.socketId) && (((brackette.currentTournamentId !== currentTournamentId) && brackette.currentTournamentId) || Object.keys(OPEN_MATCHES).length === 0)) {
        // if this dude is a server, get the matches.
        challongeClient.matches.index({
          id: brackette.currentTournamentId,
          state: 'open',
          callback: (err, data) => {
            if (err || !brackette.currentTournamentId) {
              console.log('There was an error communicating with Brackette.')
              socket.emit('brackette error', {message: 'There was an error with the tournament ID given...'})
              OPEN_MATCHES = {}
              ALL_PLAYERS_NAME = {}
              return
            }
            currentTournamentId = brackette.currentTournamentId
            OPEN_MATCHES = err ? {} : data
            socket.emit('receive matches', OPEN_MATCHES)
            // now get the all players names...
            challongeClient.participants.index({
              id: brackette.currentTournamentId,
              callback: (err, data) => {
                if (err) {
                  console.log('Error getting all players name...')
                  OPEN_MATCHES = {}
                  ALL_PLAYERS_NAME = {}
                  socket.emit('brackette error', {message: 'There was an error getting the players names...'})
                  return
                }
                // store ALL_PLAYERS to object by their player id.
                for (const i in data) {
                  ALL_PLAYERS_NAME[data[i].participant.id] = data[i].participant.displayName
                }
                socket.emit('receive players names', ALL_PLAYERS_NAME)
              }
            })
          }
        })
      } else {
        // TODO: Do something here ???
      }
      io.sockets.emit('update brackettes', ALL_BRACKETTES) // tell every connected user
    })
    socket.on('send private match details', (matchDetails) => {
      if (Object.keys(OPEN_MATCHES).length !== 0) {
          // here we would calculate the match! nice...
        io.to(matchDetails.socketId).emit('receive match details', matchDetails.specificMatch)
      } else {
        socket.emit('brackette error', {message: 'There are no open matches...'})
      }
    })

    socket.on('send match results', (matchRes) => {
      challongeClient.matches.update({
        id: currentTournamentId,
        matchId: matchRes.match.matchId,
        match: {
          scoresCsv: matchRes.match.score,
          winnerId: matchRes.match.winnerId
        },
        callback: (err, data) => {
          if (err) {
            console.log('Error sending match results.')
            console.dir(err)
            socket.emit('brackette error', {message: 'There was an error with the tournament ID given...'})
              // FIXME: Make these errors more specific :P
            return
          }
          // now we need to get the new set of open tournaments....
          // could this be it's own function I wonder...
          challongeClient.matches.index({
            id: currentTournamentId,
            state: 'open',
            callback: (err, data) => {
              if (err) {
                console.dir("Error retrieving open matches from Challonge.")
                socket.emit('brackette error', {message: 'There was an error with the tournament ID given...'})
                OPEN_MATCHES = {}
                return
              }
              OPEN_MATCHES = data
              // this emit will tell the server that it needs to update a few things...
              io.to(matchRes.hostToSend.socketId).emit('update matches', OPEN_MATCHES)
            }
          })
        }
      })
    })

    socket.on('disconnect', () => {
      console.log('someone disconnected', socket.id)
      delete ALL_BRACKETTES[socket.id]
   // io.sockets.emit('someone_left', bracketteUserThatLeft)
      io.sockets.emit('update brackettes', ALL_BRACKETTES)
    })
  })

  function isHost (socketId)  {
    return ALL_BRACKETTES[socketId].role === 'host'
  }
}
