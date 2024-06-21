import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
dotenv.config()

import authRouter from './routes/auth.route.js'
import UserRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'

import Error from './middlewares/Error.js'
import isAuthenticated from './middlewares/isAuthenticated.js'

import DB_CONNECT from './utils/database.js'
import { getDirName } from './utils/getDirName.js'

const app = express()

const __dirname = getDirName(import.meta.url)

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const PORT = process.env.PORT

// App Configuration
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use('/uploads', express.static(uploadsDir))

// Connecting to MongoDB database
DB_CONNECT()

// Router for Authentication
app.use('/api/auth', authRouter)
app.use('/api/user', UserRouter)
app.use('/api/post', postRouter)

// Middlewares
app.use(Error)

// Running Server
app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
})