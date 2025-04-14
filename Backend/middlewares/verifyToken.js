import user from '../models/user.js'
import jwt from 'jsonwebtoken'

export const verifyToken =async (req,res,next)=>{
   try{

    const token = req.cookies.jwt
     console.log('token',token)
    if(!token){
        return res.status(401).json({error:"Unauthorized access!"})
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({error:'User not authorized!'})
    }
    const user1 = decoded.userId
    const authUser = await user.findById(user1).select("-password")
    req.user = authUser
    next()
    
   }catch(error){
    console.log('Error vt',error)
      return res.status(500).json({error:"Error in verify token api"})
   }
}