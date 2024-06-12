import mongoose from 'mongoose'

import Post from '../models/user.model.js'

export const get_posts = async (req, res, next) => {
    try{
        const posts = await Post.find().populate('author', 'username').exec()
        return res.status(200).json({
            success: true,
            message: 'Post retrieved successfully',
            posts,
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err
        }) 
    }
}

export const get_post = async (req, res, next) => {
    try{
        const { postId } = req.params

        if(!mongoose.Types.ObjectId.isValid(postId)){
            return res.status(400).json({
                success: false,
                message: 'Invalid post ID'
            })
        }

        const post = await Post.findById(postId).populate('author', 'username')

        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Post does not exist'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Post retrieved successfully',
            post
        })

    }catch(err){
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err
        })
    }
}