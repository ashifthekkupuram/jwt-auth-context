import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const isAuthenticated = (req, res, next) => {
    if(req.headers.authorization === undefined || req.headers.authorization === null){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    const token = req.headers.authorization.split(' ')[1]

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token not found"
        })
    }

    try{
        jwt.verify(token, process.env.SECRET_KEY, (err, result) =>{
            if(err){
                return res.status(400).json({
                    success: false,
                    message: 'Something went wrong',
                    error: err
                })
            }

            if(result){
                req.token = token
                next()
            }else {
                return res.status(400).json({
                    success: false,
                    message: 'Token is not valid or expired'
                })
            }
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err
        })
    }
}

export default isAuthenticated