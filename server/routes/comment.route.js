import express from 'express'

import IsAuthor from '../middlewares/isAuthor.js'
import isAuthorOrCommenter from '../middlewares/isAuthorOrCommenter.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { get_comments, create_comment,delete_comment } from '../controllers/comment.controller.js'

const router = express.Router()

router.get('/:postId', get_comments)

router.post('/:postId', isAuthenticated, create_comment)

router.delete('/:commentId', isAuthenticated, isAuthorOrCommenter, delete_comment)

export default router