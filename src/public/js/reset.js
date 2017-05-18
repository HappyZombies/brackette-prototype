$('#reset').click(function () {
  var pass = prompt('Enter the password')
  if (pass) {
    $.ajax({
      url: '/setup/reset',
      type: 'post',
      data: {password: pass},
      success: function (res) {
        if (!res.success) {
          alert('Wrong password')
          return
        }
        window.location = '/setup'
      }
    })
  }
})
