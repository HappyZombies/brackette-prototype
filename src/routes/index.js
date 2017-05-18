const app = require('express').Router()

app.use('/setup', require('./setup'))
app.use('/', require('./home'))

module.exports = app
