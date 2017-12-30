import TwitterStrategy from 'passport-twitter'
import { User } from '../models/user'
import { Twitter } from '../models/twitter'
import { conf } from '../app'


export const initTwitterStrategy = (passport) => {
  passport.use(new TwitterStrategy({
    consumerKey: conf.get('twitterConsumerKey'),
    consumerSecret: conf.get('twitterConsumerSecret'),
    callbackURL: conf.get('twitterCallbackURL'),
    passReqToCallback: true
  },
  async (req, token, refreshToken, profile, done) => {
    try {
      console.log(JSON.stringify(profile))
      let twitter = await Twitter.findOne({
        where: { 'id': profile.id },
        attributes: [ 'id', 'token', 'name', 'username', ]
      })
      if (twitter === null) {
        twitter = await Twitter.create({
          id: profile.id,
          token,
          name: profile.displayName,
          username: profile.username
        })
      }
      let user = await User.findOne({
        where: { 'twitter_id': profile.id },
        include: [ Twitter ],
        attributes: [ 'id', 'email', 'password', 'salt', ]
      })
      if (user === null && !req.user) {
        user = await User.create({}, { include: [ Twitter ] })
      }
      if (req.user) {
        if (user) {
          await user.destroy()
        }
        user = req.user
      }
      await user.setTwitter(twitter)
      await user.save()
      done(null, user)
    } catch(error) {
      done(error)
    }
  }))
}
