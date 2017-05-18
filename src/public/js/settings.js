$(function () {
  $.ajax({
    url: '../templates/SettingsModal.hbs',
    success: function (data) {
      var template = Handlebars.compile(data)
        // Don't send all the data to the hbs.
      var settingsModalData = {
        name: Brackette.name,
        isServer: isServer(),
        tournamentid: Brackette.tournamentId
      }
      $('#settings-dialog').html(template(settingsModalData))
    }
  })
  $('#settings-button').click(function () {
    // When they click the settings button...
    $('#settings-submit-form').click(function (e) {
      var name = $('input[name="settings-name"]').val()
      var role = $('input[name="settings-role"]:checked').val()
      var tournamentid = $('input[name="settings-tournamentid"]').val()
      Brackette.name = name
      Brackette.role = role
      Brackette.tournamentId = (tournamentid === 'undefined') ? undefined : tournamentid
      Cookies.set('name', name)
      Cookies.set('role', role)
      if (Brackette.tournamentId) {
        Cookies.set('tournamentid', Brackette.tournamentId)
      }
      location.reload() // sorry....
    })
    $('#settings-reset').click(function () {
      socket.emit('resetEveryone')
    })
  })
})
