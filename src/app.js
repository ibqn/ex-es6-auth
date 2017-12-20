import express from 'express'
import nconf from 'nconf'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { initLocalStrategy } from './strategy/local'
import session from 'express-session'
import flash from 'connect-flash'
import bodyParser from 'body-parser'
import sassMiddleware from 'node-sass-middleware'
import { initDb } from './db'
import dotenv from 'dotenv'

import index from './routes/index'
import users from './routes/users'


export const app = express()

dotenv.config({ path: path.join(__dirname, 'keys.env') })

export const conf = nconf.argv().env().file({
  file: path.join(__dirname, 'config.json')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: conf.get('sessionSecret'), // session secret
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use(passport.session())
initLocalStrategy(passport)

initDb().catch(error => {
  console.error(`Database connection error: ${error.stack}`)
  process.exit(1)
})

app.use('/', index)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(async (req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(async (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  err.status = err.status || 500
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status)
  res.render('error')
})
