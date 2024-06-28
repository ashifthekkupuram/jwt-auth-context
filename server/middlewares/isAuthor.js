import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const isAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(jwt.decode(req.token)._id);
    const { postId } = req.params;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    const post = await Post.findById(postId).populate("author", "username");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No post found",
      });
    }

    if (post.author._id.toString() === user._id.toString()) {
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

export default isAuthor;
