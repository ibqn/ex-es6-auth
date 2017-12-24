import passport from 'passport'
import { Router } from 'express'


const router = Router()

router.get('/google',
  passport.authorize('google', { scope : ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authorize('google', { successRedirect : '/profile', failureRedirect : '/' })
)

export default router
