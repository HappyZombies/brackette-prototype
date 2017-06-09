const setup = require('express').Router()
const fs = require('fs')
const configPath = process.cwd() + '/config.json'
const config = JSON.parse(fs.readFileSync(configPath))
const challonge = require('challonge')

setup.post('/', (req, res) => {
  const apikey = req.body.apikey
  // const password = req.body.password // TODO: Add password field
  const client = challonge.createClient({
    apiKey: apikey
  })
  client.tournaments.index({
    callback: (err) => {
      if (err) {
        console.log('Error on setup!')
        console.log(err)
        return res.json({error: err.text}).status(401)
      }
      config.setup = true
      config.apikey = apikey
      config.password = 'password'
      fs.writeFileSync(configPath, JSON.stringify(config), 'utf8')
      res.json({success: true}).status(200)
    }
  })
})

setup.post('/reset', (req, res) => {
  const password = req.body.password
  if (password !== config.password) {
    return res.json({success: false})
  }
  config.setup = false
  config.apikey = ''
  config.password = ''
  fs.writeFileSync(configPath, JSON.stringify(config), 'utf8')
  res.json({success: true})
})

setup.get('/setup-config', (req, res) => {
  res.json({setup: config.setup})
})

module.exports = setup
