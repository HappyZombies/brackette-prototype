import express from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import routes from './routes'

dotenv.config()
const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

module.exports = app
