const home = require('express').Router()

home.get('/', (req, res) => {
  res.render('home')
})

home.get('/ip', (req, res) => {
  res.render('ip')
})

module.exports = home
