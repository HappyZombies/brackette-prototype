// Setup our object
// Overall Idea of this: Whoever is a server, must contain the tournament ID...
// Clients do not know the tournament ID, all they do is receive match data and return match results.
// Server will do all the communicatting to challonge.
var Brackette = {
  role: Cookies.get('role'),
  name: Cookies.get('name'),
  id: 0,
  allBrackettes: {},
  openMatches: {},
  allPlayersName: {},
  setup: (Cookies.get('role') !== undefined),
  tournamentId: (Cookies.get('role') === 'client') ? undefined : Cookies.get('tournamentid'),
  inprogress: (Cookies.get('inprogress') !== undefined),
  currentMatch: Cookies.get('currentMatch') ? Cookies.get('currentMatch') : {}
}

// Create our custom error Event
var bracketteErrorEvent = new CustomEvent('bracketteError',
  {
    detail: {
      message: 'There was a Brackette Type Error.'
    },
    bubbles: true,
    cancelable: true
  }
)


// on brackette Error, hide everything
document.addEventListener('bracketteError', function (e) {
  $('#root').hide()
}, false)
// Let's check their role before we continue...
assignRole()
// If they are setup, let's run our socket connection
if (Brackette.setup) {
  var socket = io({transports: ['websocket'], upgrade: false})
  // determineDisplay()

  // load important hbs templates here...
  $.ajax({
    url: '../templates/AllClientsModal.hbs',
    cache: true,
    success: function (data) {
      var template = Handlebars.compile(data)
      $('#allClientsModal').html(template()) // we don't have any {{}}
    }
  })
  runSockets()
  if (Object.keys(Brackette.currentMatch).length !== 0) {
    displayFormMatch(JSON.parse(Brackette.currentMatch))
  }
}

function assignRole () {
  if (!Brackette.setup) {
      // There is no role. Let's request the user one.
      // First load the template
    $.ajax({
      url: '../templates/RoleModal.hbs',
      cache: true,
      success: function (data) {
        var template = Handlebars.compile(data)
        $('#roleModal').html(template()) // we don't have any {{}}
      }
    })
      // Although this would target any other ajax events we have, this one will only run if we are Not setup yet.
    $(document).ajaxComplete(function () {
      $('#role-dialog').modal('show')
      roleDialogEvents()
    })
  }
}

function runSockets () {
  // When they first connect, let's emit the event of add user to the server side, passing in our Brackette object we made.
  socket.on('connect', function () {
    socket.emit('addUser', Brackette)
  })

  // addUser will emit an update, let's listen for that event.
  socket.on('update', function (allBrackettes) {
    // on update, we get an object which contains all of the connected Brackette users.

    // this is to set the display for the appropiate user.
    var $displayHTML = $('<div/>')
    $('#display').empty()
    $('#available-clients').empty()
    $('#clients-dialog').modal('hide') // this is a temporary bug that needs to be fixed. bug #4
    // Brackette will contain a property which contains all of the connected brackette users, even itself.
    Brackette.allBrackettes = allBrackettes
    // Set this brackette id where it's name equals.
    Brackette.id = _.find(Brackette.allBrackettes, function (obj) {
      return obj.name === Brackette.name
    }).id

    // Determine what to display based on their role.
    if (isServer()) {
      // attach our modal to div from the hbs.
      var $matchDiv
      $('#clients-dialog').on('show.bs.modal', function (e) {
        $matchDiv = $(e.relatedTarget)
      })
      for (var key in Brackette.allBrackettes) {
        // Loop thru each to display all brackette users.
        if (Brackette.id !== allBrackettes[key].id) {
          // If it's ourselves...don't bother. TODO: Maybe we could remove ourselves to avoid this check ?
          // So now we create an button object and append it to the variable as we loop.
          // Note here how this works, for each client connected, we create a button for them with a unique id
          // and each has their own click function that will emit send message.

          // TODO: Make this button...better if possible ?
          // Clicking this button will send the match data to the client specified.
          var button = $('<button/>').attr({
            class: 'btn pmd-ripple-effect btn-primary ' + ((Brackette.allBrackettes[key].inprogress) ? 'disabled' : ''), // THIS IS STUPID
            id: allBrackettes[key].id
          }).text(allBrackettes[key].name).click(function (e) {
            if (this.className.includes('disabled')) { // THIS IS STUPID TOO
              return
            }
            var messageToClient = {
              specificBrackette: Brackette.allBrackettes[this.id], // this.id being the id of the appropiate brackette client we want...
              specificMatch: _.find(Brackette.openMatches, function (obj) {
                return obj.match.id === parseInt($matchDiv[0].id) // this being the id of the match based on the div that was clicked.
              })
            }
            // target the progress for the current div we selected...
            updateProgress($matchDiv[0].id, 'In Progress')
            $matchDiv[0].disabled = true
            $('#clients-dialog').modal('hide')
            socket.emit('sendPrivateMatchDetails', messageToClient)
          })
          $displayHTML.append(button)
        }
      }
      $('#available-clients').append($displayHTML)
    } else if (isClient()) {
      // If we are a client, we want to display the one and only server avialable.
      var serverBrackette = _.find(Brackette.allBrackettes, function (obj) {
        return obj.role === 'server'
      })
      // situations can occur where server is not present (if like they reload or something...)
      if (serverBrackette) {
        var button = $('<button/>').attr({
          class: 'btn pmd-ripple-effect btn-success',
          id: serverBrackette.id
        })
          .text('Send results to ' + serverBrackette.name)
          .click(function (e) {
            // onclick, get the match results, TODO: Check if we have a current match here too.
            var winnerId = $('input[name="winner"]:checked').val()
            if (confirm('Are these results correct ?') && winnerId) {
              var matchRes = {
                match: {
                  matchId: $('#matchId').val(),
                  winnerid: winnerId,
                  score: $('#player1Score').val() + '-' + $('#player2Score').val()
                },
                server: serverBrackette
              }
              console.dir(matchRes)
              console.log('yes confirmed')
              socket.emit('sendMatchResults', matchRes)
              // we are done here so reset some of our values...
              Cookies.remove('currentMatch')
              Brackette.currentMatch = {}
              Cookies.remove('inprogress') // FIXME: yes, it makes sense to set this to false but currently the way it's setup is incorrect
              Brackette.inprogress = false
              $('#clientIndividualMatch').empty()
              socket.emit('updateUser', Brackette)
              return
            }
            console.log('cancelled...')
          })
        $displayHTML.append(button)
      }
      $('#display').append($displayHTML)
    }
  })

  socket.on('updateOpenMatches', function (data) {
    Brackette.openMatches = data
    if (Object.keys(Brackette.openMatches).length === 0) {
      alert('There are no open matches')
    }
  })

  socket.on('someone_left', function (bracketteUserThatLeft) {
    // let's check if there is a match in progress and update the UI.
    // did they have a match ?
    if (bracketteUserThatLeft.inprogress) {
      // darn it, they had a match in progress...
      // the buttons for each match have their id...so we have that id. grab that button
      $('#' + bracketteUserThatLeft.currentMatch.match.id)[0].disabled = false
      updateProgress(bracketteUserThatLeft.currentMatch.match.id, 'Open')
    }
  })

  socket.on('updatePlayersName', function (data) {
    $('#matches').empty()
    Brackette.allPlayersName = data
    // so we have these values...so update the UI for server.
    updateServerMatchesDisplay()
  })

  socket.on('updateServerMatchDisplay', function () {
    $('#matches').empty()
    updateServerMatchesDisplay()
  })

  socket.on('receiveMatchDetails', function (matchData) {
    // a client will receive this data...and update the UI
    // the onclick button from before will trigger the emit, sending the data
    Cookies.set('inprogress', true) // for the client button...
    Cookies.set('currentMatch', matchData)
    Brackette.currentMatch = matchData
    Brackette.inprogress = true
    socket.emit('updateUser', Brackette) // send to everyone to update global object.
    displayFormMatch(matchData)
  })

  socket.on('tournamentIdErr', function (data) {
    document.dispatchEvent(bracketteErrorEvent) // trigger our event
    Brackette.openMatches = {}
    Brackette.allPlayersName = {}
    console.log('There was an error')
    console.dir(Brackette.openMatches)
    alert(data.message)
  })

  socket.on('sendMatchDetailsError', function (data) {
    alert(data.message)
  })

  socket.on('usersWereUpdated', function (data) {
    Brackette.allBrackettes = data
    console.log('all brackettes property was updated.')
  })

  socket.on('reset', function () {
    deleteAllCookies()
    location.reload()
  })
}

function isClient () {
  return Brackette.role === 'client'
}

function isServer () {
  return Brackette.role === 'server'
}

function roleDialogEvents () {
  $('#submit-form').click(function () {
    // When they click submit, get the name value.
    var name = $('input[name="name"]').val()
    var role = $('input[name="role"]:checked').val()
    Brackette.role = role
    Brackette.name = name
    Cookies.set('name', name)
    Cookies.set('role', role)
  })
  $('#role-dialog').on('hidden.bs.modal', function (e) {
    // If they leave the screen and there is no value inside the form, show modal again.
    if (!$('input[name="name"]').val() || !$('input[name="role"]:checked').val()) {
        // Jerks
      $('#role-dialog').modal('show')
      return
    }
    location.reload()
  })
}

function displayFormMatch (matchData) {
  $.ajax({
    url: '../templates/ClientMatchesDisplay.hbs',
    cache: true,
    success: function (data) {
      var template = Handlebars.compile(data)
      $('#clientIndividualMatch').html(template(matchData))
    }
  })
}

function deleteAllCookies () {
  var cookies = document.cookie.split(';')
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i]
    var eqPos = cookie.indexOf('=')
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

function updateServerMatchesDisplay () {
  $.ajax({
    url: '../templates/Matches.hbs',
    cache: true,
    success: function (data) {
      var template = Handlebars.compile(data)
      for (var key in Brackette.openMatches) {
        Brackette.openMatches[key].match.player1Name = Brackette.allPlayersName[Brackette.openMatches[key].match.player1Id]
        Brackette.openMatches[key].match.player2Name = Brackette.allPlayersName[Brackette.openMatches[key].match.player2Id]
        Brackette.openMatches[key].match.inprogress = _.find(Brackette.allBrackettes, function (obj) {
          var objmatch
          if (typeof obj.currentMatch === 'string') {
            objmatch = Object.keys(obj.currentMatch).length !== 0 ? (JSON.parse(obj.currentMatch)) : undefined
          } else {
            objmatch = Object.keys(obj.currentMatch).length !== 0 ? (obj.currentMatch) : undefined
          }
          if (objmatch) {
            var aMatch = Brackette.openMatches[key].match
            return (objmatch.match.id == aMatch.id)
          }
        })
            // stupid stupid stupid.
        Brackette.openMatches[key].match.inprogress = Brackette.openMatches[key].match.inprogress ? true : false
        $('#matches').append(template(Brackette.openMatches[key].match)) // pass match data to hbs
      }
    }
  })
}

function updateProgress (matchId, text) {
  var spanId = '#' + matchId + '-progress'
  $(spanId).text(text)
}
