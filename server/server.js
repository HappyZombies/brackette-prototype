const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '../src')))
app.use(express.static(path.resolve(__dirname, '../build')))
// Setup any express end points here...
app.use('/', require('./routes'))

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'))
})

module.exports = app
