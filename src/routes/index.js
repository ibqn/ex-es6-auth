import { Router } from 'express'
import { asyncMiddleware } from '../tools'


const router = Router()

// GET home page.
router.get('/', asyncMiddleware(async(req, res, /* next */) =>
  res.render('index', { title: 'Express' })
))

router.get('/login', asyncMiddleware(async(req, res, /* next */) =>
  res.render('login', {
    title: 'Login',
    message: req.flash('loginMessage')
  })
))

export default router
