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
      let user = await User.findOne({
        where: { 'google_id': profile.id },
        include: [ Google ],
        attributes: [ 'id', 'email', 'password', 'salt', ]
      })

      if(user === null) {
        console.log(JSON.stringify(profile))
        console.log('build new one')
        console.log(`emails ${profile.emails}`)
        console.log(`name ${profile.DisplayName}`)
        user = await User.build({
          google: {
            id: profile.id,
            token,
            name: profile.displayName,
            email: (profile.emails && profile.emails[0].value || '').toLowerCase()
          }
        },
        {
          include: [ Google ]
        })
        await user.save()
      }
      console.log(`user id ${user.id}`)
      done(null, user)
    } catch(error) {
      done(error)
    }
  }))
}
