import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import User from '../models/user.model.js'
import Post from '../models/post.model.js'

dotenv.config()

const USERNAME_REGEX = /^[a-z0-9_]{4,25}$/g;

export const update_username = async (req, res, next) => {

    const { username } = req.body
    const userId = jwt.decode(req.token, process.env.SECRET_KEY).id

    if(!username){
        return res.status(400).json({
            success: false,
            message: 'Username required'
        })
    }

    if(!username.match(USERNAME_REGEX)){
        return res.status(400).json({
            success: false,
            message: 'Not a valid username'
        })
    }

    const usernameExist = await User.findOne({username})

    if(usernameExist){
        return res.status(400).json({
            success: false,
            message: 'Username already exist'
        })
    }

    try{
        await User.findByIdAndUpdate(userId, {username})
        return res.status(200).json({
            success: true,
            message: 'Username Updated',
            updatedUsername: username
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err
        })
    }

}

export const update_profile = async (req, res, next) => {

    const profile = req.file
    const userId = jwt.decode(req.token, process.env.SECRET_KEY).id

    if(!profile){
        return res.status(400).json({
            success: false,
            message: 'An profile image is required'
        })
    }

    try{
        await User.findByIdAndUpdate(userId, {profile: `http://localhost:${process.env.PORT}/uploads/${profile.filename}`})
        return res.status(200).json({
            success: true,
            message: 'Profile updated',
            filename: `http://localhost:${process.env.PORT}/uploads/${profile.filename}`
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err
        })
    }

}

export const get_user = async (req, res, next) => {
    try{

        const {userId} = req.params

        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User id is required!"
            })
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            })
        }

        const user = await User.findById(userId, 'username profile')

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const posts = Post.find({author: user}).populate('author', 'username profile')

        return res.status(200).json({
            success: true,
            message: 'User Retrieved',
            user,
            posts
        })

    }catch(err){
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err
        })
    }
}