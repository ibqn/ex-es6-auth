import passport from 'passport'
import { Router } from 'express'


const router = Router()

// send to facebook to do the authentication
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: [ 'public_profile', 'email' ] })
)

// handle the callback after facebook has authenticated the user
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/' })
)

export default router
