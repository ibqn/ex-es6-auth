import FacebookStrategy from 'passport-facebook'
import { User } from '../models/user'
import { Facebook } from '../models/facebook'
import { conf } from '../app'


export const initFacebookStrategy = (passport) => {
  passport.use(new FacebookStrategy({
    clientID: conf.get('facebookAppId'),
    clientSecret: conf.get('facebookAppSecret'),
    profileFields: ['id', 'email', 'name'],
    callbackURL: conf.get('facebookCallbackURL'),
    passReqToCallback: true
  },
  async (req, token, refreshToken, profile, done) => {
    try {
      let facebook = await Facebook.findOne({
        where: { 'id': profile.id },
        attributes: [ 'id', 'token', 'name', 'email', ]
      })
      if (facebook === null) {
        facebook = await Facebook.create({
          id: profile.id,
          token,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: (
            profile.emails && profile.emails[0].value || ''
          ).toLowerCase()
        })
      }
      let user = await User.findOne({
        where: { 'facebook_id': profile.id },
        include: [ Facebook ],
        attributes: [ 'id', 'email', 'password', 'salt', ]
      })
      if (user === null && !req.user) {
        user = await User.create({}, { include: [ Facebook ] })
      }
      if (req.user) {
        if (user) {
          await user.destroy()
        }
        user = req.user
      }
      await user.setFacebook(facebook)
      await user.save()
      done(null, user)
    } catch(error) {
      done(error)
    }
  }))
}
