import express from express

import { get_posts, get_post } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', get_posts)

router.get('/:postId', get_post)

export default router