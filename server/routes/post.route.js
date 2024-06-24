import express from 'express'

import { get_posts, get_post, create_post, delete_post, update_post } from '../controllers/post.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../utils/multer.js'
import isAuthor from '../middlewares/isAuthor.js'

const router = express.Router()

router.get('/', get_posts)

router.post('/', isAuthenticated, upload.single('image'), create_post)

router.get('/:postId', get_post)

router.delete('/:postId', isAuthenticated, isAuthor, delete_post)

router.put('/:postId', isAuthenticated, isAuthor,upload.single('image'), update_post)

export default router