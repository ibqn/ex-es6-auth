//import passport from 'passport'
import crypto from 'crypto'
import LocalStrategy from 'passport-local'
import { User } from './models/user'


export const initLocalStrategy = (passport) => {
  // used to serialize the user for the session
  passport.serializeUser(async (user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id: id },
        attributes: [ 'id', 'email', 'password' ]
      })
      done(null, user)
    } catch(error) {
      done(error)
    }
  })

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    // allows us to pass back the entire request to the callback
    passReqToCallback: true
  },
  // callback with email and password from our form
  async function(req, email, password, done) {
    try {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      const user = await User.findOne({
        where: { email: email },
        attributes: [ 'id', 'email' ]
      })
      // if no user is found, return the message
      if (user === null) {
        // req.flash is the way to set flashdata using connect-flash
        return done(
          null,
          false,
          req.flash('loginMessage', 'No user found.')
        )
      }
      // if the user is found but the password is wrong
      if (!user.validPassword(password)) {
        // create the loginMessage and save it to session as flashdata
        return done(
          null,
          false,
          req.flash('loginMessage', 'Oops! Wrong password.')
        )
      }
      // all is well, return successful user
      return done(null, user)
    } catch (error) {
      // if there are any errors, return the error before anything else
      return done(error)
    }
  }))

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    // allows us to pass back the entire request to the callback
    passReqToCallback: true
  },
  async function(req, email, password, done) {
    try {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      let user = await User.findOne({
        where: { email: email },
        attributes: [ 'id', 'email' ]
      })
      if (user) {
        return done(
          null,
          false,
          req.flash('signupMessage', 'That email is already taken.')
        )
      } else {
        // if there is no user with that email
        // create the user
        user = await User.build({ email })
        await user.setPassword(password)
        await user.save()
        return done(null, user)
      }
    } catch(error) {
      return done(error)
    }
  }))

}
