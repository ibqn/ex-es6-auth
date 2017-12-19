import { Router } from 'express'
import { asyncMiddleware } from '../tools'
import passport from 'passport'


const router = Router()

// GET home page.
router.get('/', asyncMiddleware(async(req, res, /* next */) =>
  res.render('index', { title: 'Express' })
))

// route middleware to ensure user is logged in
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated())
    return next()

  res.redirect('/')
}

router.get('/profile', ensureAuth, asyncMiddleware(async(req, res, /* next */) =>
  res.render('profile', { title: 'Profile', user: req.user })
))

router.get('/login', asyncMiddleware(async(req, res, /* next */) =>
  res.render('login', {
    title: 'Login',
    message: req.flash('loginMessage')
  })
))

router.post('/login',
  passport.authenticate('local-login', { failureRedirect: '/login' }),
  asyncMiddleware(async (req, res) => res.redirect('/profile'))
)

router.get('/logout', asyncMiddleware(async (req, res) => {
  req.logout()
  res.redirect('/')
}))

router.get('/signup', asyncMiddleware(async(req, res, /* next */) =>
  res.render('signup', {
    title: 'Signup',
    message: req.flash('signupMessage')
  })
))

router.post('/signup',
  passport.authenticate('local-signup', { failureRedirect: '/signup' }),
  asyncMiddleware(async (req, res) => res.redirect('/profile'))
)

export default router
