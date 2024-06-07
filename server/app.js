import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRouter from './routes/auth.route.js'
import UserRouter from './routes/user.route.js'

import isAuthenticated from './middlewares/isAuthenticated.js'

import DB_CONNECT from './utils/database.js'

const app = express()

const PORT = process.env.PORT

// App Configuration
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// Connecting to MongoDB database
DB_CONNECT()

// Router for Authentication
app.use('/api/auth', authRouter)
app.use('/api/user', isAuthenticated, UserRouter)

// Running Server
app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
})