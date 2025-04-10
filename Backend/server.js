import express from 'express'
import auth from './routes/auth.js'
import dotenv from 'dotenv'
import { connectDb } from './DB/connectMongoDb.js'
dotenv.config()

const app = express()

app.use("/api/auth",auth)

console.log('Mongo',process.env.MONGO_URI)


  
app.listen(8000,()=>{
    console.log('Server is running on port')
    connectDb()
})