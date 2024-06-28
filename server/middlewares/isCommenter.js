import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

const isCommenter = async (req, res, next) => {
  try {
    const user = await User.findById(jwt.decode(req.token)._id);
    const { commentId } = req.params;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    const comment = await Comment.findById(commentId).populate(
      "author",
      "username"
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "No comment found",
      });
    }

    if (comment.author._id.toString() === user._id.toString()) {
      return next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Forbidden Access",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

export default isCommenter;
