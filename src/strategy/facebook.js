import FacebookStrategy from 'passport-facebook'
import { User } from '../models/user'
import { Facebook } from '../models/facebook'
import { conf } from '../app'


export const initFacebookStrategy = (passport) => {
  passport.use(new FacebookStrategy({
    clientID: conf.get('facebookAppId'),
    clientSecret: conf.get('facebookAppSecret'),
    profileFields: ['id', 'email', 'name'],
    callbackURL: 'http://localhost:8000/auth/facebook/callback',
    passReqToCallback: true
  },
  async (req, token, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({
        where: { 'facebook_id': profile.id },
        include: [ Facebook ],
        attributes: [ 'id', 'email', 'password', 'salt', ]
      })

      if(user === null) {
        console.log(JSON.stringify(profile))
        console.log('build new one')
        console.log(`emails ${profile.email}`)
        console.log(`name ${profile.name}`)
        user = await User.build({
          facebook: {
            id: profile.id,
            token,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            email: (profile.emails && profile.emails[0].value || '').toLowerCase()
          }
        },
        {
          include: [ Facebook ]
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
