const express = require('express')
const app = express()
const server = require('http').Server(app)
const setupConfig = require('../config.json')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const path = require('path')
require('ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set('views', './src/views')
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, './public')))
app.use(expressLayouts)
app.use((req, res, next) => {
  if (!setupConfig.setup || setupConfig.apikey === '') {
    if (req.path === '/setup') {
      return next()
    }
    return res.redirect('/setup')
  }
  next()
})
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

app.use('/', require('./routes'))
require('./sockets').listen(server)
server.listen(80, () => {
  console.log('Server is running on your localhost. Go to http://localhost/ip to see your network ip and share it with your other devices.')
})
