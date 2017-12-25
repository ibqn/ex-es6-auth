import GoogleStrategy from 'passport-google-oauth20'
import { User } from '../models/user'
import { Google } from '../models/google'
import { conf } from '../app'


export const initGoogleStrategy = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: conf.get('googleClientId'),
    clientSecret: conf.get('googleClientSecret'),
    callbackURL: conf.get('googleCallbackURL'),
    passReqToCallback: true
  },
  async (req, token, refreshToken, profile, done) => {
    try {
      let google = await Google.findOne({
        where: { 'id': profile.id },
        attributes: [ 'id', 'token', 'name', 'email', ]
      })
      if (google === null) {
        google = await Google.create({
          id: profile.id,
          token,
          name: profile.displayName,
          email: (
            profile.emails && profile.emails[0].value || ''
          ).toLowerCase()
        })
      }
      let user = await User.findOne({
        where: { 'google_id': profile.id },
        include: [ Google ],
        attributes: [ 'id', 'email', 'password', 'salt', ]
      })
      if (user === null && !req.user) {
        user = await User.create({}, { include: [ Google ] })
      }
      if (req.user) {
        if (user) {
          await user.destroy()
        }
        user = req.user
      }
      await user.setGoogle(google)
      await user.save()
      done(null, user)
    } catch(error) {
      done(error)
    }
  }))
}
