import express from 'express'

import { update_username } from '../controllers/user.controller.js'

const router = express.Router()

router.post('/update_username', update_username)

export default router