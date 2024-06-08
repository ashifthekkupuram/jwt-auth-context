import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import User from '../models/user.model.js'

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
        await User.findByIdAndUpdate(userId, {profile: profile.filename})
        return res.status(200).json({
            success: true,
            message: 'Profile updated',
            filename: profile.filename
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err
        })
    }

}