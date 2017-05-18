const setup = require('express').Router()
const fs = require('fs')
const path = require('path')
const setupConfig = require('../../config.json')
const challonge = require('challonge')

setup.get('/', (req, res) => {
  if (setupConfig.setup && setupConfig.apikey !== '') {
    return res.render('reset')
  }
  res.render('setup')
})

setup.post('/', (req, res) => {
  const apikey = req.body.apikey
  const password = req.body.password
  const client = challonge.createClient({
    apiKey: apikey
  })
  client.tournaments.index({
    callback: (err, data) => {
      if (err) {
        console.log('Yes error...')
        return res.send({error: err.text})
      }
      setupConfig.setup = true
      setupConfig.apikey = apikey
      setupConfig.password = password
      fs.writeFile(path.join(__dirname, '../../config.json'), JSON.stringify(setupConfig), 'utf8')
      res.send({success: true})
    }
  })
})

setup.post('/reset', (req, res) => {
  const password = req.body.password
  if (password !== setupConfig.password) {
    return res.json({success: false})
  }
  setupConfig.setup = false
  setupConfig.apikey = ''
  setupConfig.password = ''
  fs.writeFile(path.join(__dirname, '../../config.json'), JSON.stringify(setupConfig), 'utf8')
  res.json({success: true})
})

module.exports = setup
