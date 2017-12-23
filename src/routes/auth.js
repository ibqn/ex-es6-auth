import passport from 'passport'
import { Router } from 'express'


const router = Router()

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: [ 'public_profile', 'email' ] })
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/' })
)

router.get(
  '/google',
  passport.authenticate('google', { scope: [ 'profile', 'email' ] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { successRedirect: '/profile', failureRedirect: '/' })
)

export default router
