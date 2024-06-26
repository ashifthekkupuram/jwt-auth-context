import express from 'express'

import IsAuthor from '../middlewares/isAuthor.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { get_comments, create_comment } from '../controllers/comment.controller.js'

const router = express.Router()

router.get('/:postId', get_comments)

router.post('/:postId', isAuthenticated, create_comment)

export default router