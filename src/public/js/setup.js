console.log('hi from setup.js')

$(function () {
  $('#setupForm').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/setup',
      type: 'post',
      data: $('#setupForm').serialize(),
      success: function (res) {
        if (res.error) {
          alert(res.error)
          return
        }
        window.location = '/'
      }
    })
  })
})
