import express from 'express'

import { get_user,login,register,verify } from '../controllers/auth.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = express.Router()

router.get('/:userId', verify)
router.post('/login',isAuthenticated, login)
router.post('/register',isAuthenticated, register)
router.post('/verify',isAuthenticated, verify)

export default router