const app = require('express').Router()

app.use('/setup', require('./setup'))

module.exports = app
