import express from 'express'

import { get_posts, get_post } from '../controllers/post.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../utils/multer.js'

const router = express.Router()

router.get('/', get_posts)

router.post('/', isAuthenticated, upload.single('image'))

router.get('/:postId', get_post)

export default router