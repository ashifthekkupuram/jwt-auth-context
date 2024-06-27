import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js"

export const get_comments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post does not exist",
      });
    }

    const comments = await Comment.find({post,}).populate('author', 'username profile').populate('post').sort('-updatedAt')

    return res.status(200).json({
        success: true,
        message: 'Comment retrieved',
        comments,
    })

  } catch (err) {
    return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: err
      });
  }
};

export const create_comment = async (req, res, next) => {
  try{
    const { postId } = req.params
    const { content } = req.body
    const user = await User.findById(jwt.decode(req.token)._id);

    if(!user){
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }

    if(!postId && !content){
      return res.status(400).json({
        success: false,
        message: 'postId and content required'
      })
    }

    if(!mongoose.Types.ObjectId.isValid(postId)){
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      })
    }

    const post = await Post.findById(postId)

    if(!post){
      return res.status(400).json({
        success: false,
        message: 'Post does not exist'
      })
    }

    if(content.trim().length < 1){
      return res.status(400).json({
        success: false,
        message: 'Comment must have a character'
      })
    }

    const comment = new Comment({
      content: content.trim(),
      author: user,
      post,
    })

    await comment.save()

    return res.status(200).json({
      success: true,
      message: 'Comment added'
    })

  }catch(err){
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err
    });
  }
}

export const delete_comment = async (req, res, next) => {
  try{
    const { commentId } = req.params

    await Comment.findByIdAndDelete(commentId)

    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    })

  }catch(err){
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err
    });
  }
}
