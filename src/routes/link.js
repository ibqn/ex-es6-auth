import passport from 'passport'
import { Router } from 'express'


const router = Router()

router.get('/facebook',
  passport.authorize('facebook', { scope : ['public_profile', 'email'] })
)

router.get('/facebook/callback',
  passport.authorize('facebook', { successRedirect : '/profile', failureRedirect : '/' })
)

router.get('/google',
  passport.authorize('google', { scope : ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authorize('google', { successRedirect : '/profile', failureRedirect : '/' })
)

router.get('/twitter',
  passport.authorize('twitter', { scope : ['email'] })
)

router.get('/twitter/callback',
  passport.authorize('twitter', { successRedirect : '/profile', failureRedirect : '/' })
)

export default router
