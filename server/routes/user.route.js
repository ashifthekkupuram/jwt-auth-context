import express from 'express'

import upload from '../utils/multer.js'
import { get_user,update_username, update_profile } from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = express.Router()

router.get('/:userId', get_user)

router.post('/update_username',isAuthenticated, update_username)

router.post('/update_profile',isAuthenticated, upload.single('profile'),update_profile)

export default router