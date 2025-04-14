import express from 'express'
import auth from './routes/auth.js'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import notificationRoutes from './routes/notificationRoutes.js'
import dotenv from 'dotenv'
import { connectDb } from './DB/connectMongoDb.js'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'
dotenv.config()

cloudinary.config({
    cloud_name:process.env.cloudinary_cloud_name,
    api_key:process.env.cloudinary_api_key,
    api_secret:process.env.cloudinary_api_secret
})

const app = express()
app.use(express.json({limit:"5mb"}))
app.use(cookieParser())
// to handle x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",auth)
app.use("/api/user",userRoute)
app.use("/api/post",postRoute)
app.use("/api/notifications",notificationRoutes)
  
app.listen(5000,()=>{
    console.log('Server is running on port')
    connectDb()
})