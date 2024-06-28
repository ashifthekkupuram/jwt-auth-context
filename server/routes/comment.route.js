import express from "express";

import isCommenter from "../middlewares/isCommenter.js";
import isAuthorOrCommenter from "../middlewares/isAuthorOrCommenter.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  get_comments,
  create_comment,
  delete_comment,
  update_comment,
  get_comment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/single/:commentId", get_comment);

router.get("/:postId", get_comments);

router.post("/:postId", isAuthenticated, create_comment);

router.delete(
  "/:commentId",
  isAuthenticated,
  isAuthorOrCommenter,
  delete_comment
);

router.put("/:commentId", isAuthenticated, isCommenter, update_comment);

export default router;
