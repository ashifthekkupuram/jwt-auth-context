import express from 'express'

import upload from '../utils/multer.js'
import { update_username, update_profile } from '../controllers/user.controller.js'

const router = express.Router()

router.post('/update_username', update_username)

router.post('/update_profile', upload.single('profile'),update_profile)

export default router