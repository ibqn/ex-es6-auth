import LocalStrategy from 'passport-local'
import { User } from '../models/user'
import { Facebook } from '../models/facebook'


export const initLocalStrategy = (passport) => {
  passport.serializeUser(async (user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        include: [ Facebook ],
        attributes: [ 'id', 'email', 'password' ]
      })
      done(null, user)
    } catch(error) {
      done(error)
    }
  })

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async function(req, email, password, done) {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: [ 'id', 'email', 'password', 'salt' ]
      })
      if (user === null) {
        return done(
          null,
          false,
          req.flash('loginMessage', 'No user found.')
        )
      }
      if (!await user.validPassword(password)) {
        return done(
          null,
          false,
          req.flash('loginMessage', 'Oops! Wrong password.')
        )
      }
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }))

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async function(req, email, password, done) {
    try {
      let user = await User.findOne({
        where: { email },
        attributes: [ 'id', 'email' ]
      })
      if (user) {
        return done(
          null,
          false,
          req.flash('signupMessage', 'That email is already taken.')
        )
      } else {
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
