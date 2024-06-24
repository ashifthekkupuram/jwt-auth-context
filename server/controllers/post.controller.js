import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const TITLE_REGEX = /^.{6,50}$/;
const DESCRIPTION_REGEX = /^.{6,}$/;

export const get_posts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profile")
      .sort("-createdAt")
      .exec();
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      posts,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

export const get_post = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(postId).populate(
      "author",
      "username profile"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      post,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

export const create_post = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const image = req.file;
    const user = await User.findById(jwt.decode(req.token)._id);

    if (!title.trim().match(TITLE_REGEX)) {
      return res.status(400).json({
        success: false,
        message: "Title should be minimum characters of 6 and maximum of 50",
      });
    }

    if (!description.trim().match(DESCRIPTION_REGEX)) {
      return res.status(400).json({
        success: false,
        message: "Description should be minimum characters of 6",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "An image is required or image too large",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Something happened to user",
      });
    }

    try {
      const post = new Post({
        title: title.trim(),
        description: description.trim(),
        author: user._id,
        image: image
          ? `http://localhost:${process.env.PORT}/uploads/${image.filename}`
          : undefined,
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Created",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: err,
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

export const delete_post = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

export const update_post = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }

    const post = await Post.findById(postId).populate(
      "author",
      "username email profile"
    );

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    const { title, description } = req.body;
    const image = req.file;

    if (!title && description) {
      return res.status(400).json({
        success: false,
        message: "title and description required",
      });
    }

    if (!title.trim().match(TITLE_REGEX)) {
      return res.status(400).json({
        success: false,
        message: "Title should be minimum characters of 6 and maximum of 50",
      });
    }

    if (!description.trim().match(DESCRIPTION_REGEX)) {
      return res.status(400).json({
        success: false,
        message: "Description should be minimum characters of 6",
      });
    }

    if (image) {
      try {
        await Post.findByIdAndUpdate(postId, {
          title: title.trim(),
          description: description.trim(),
          image: `http://localhost:${process.env.PORT}/uploads/${image.filename}`
        });

        return res.status(200).json({
            success: true,
            message: 'Post Updated'
        })

      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      }
    } else {
        try {
            await Post.findByIdAndUpdate(postId, {
              title: title.trim(),
              description: description.trim(),
            });

            return res.status(200).json({
                success: true,
                message: 'Post Updated'
            })
          } catch (err) {
            return res.status(400).json({
              success: false,
              message: "Something went wrong",
              error: err,
            });
          } 
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};
