import { genrateTokenAndSetCookies } from "../lib/utils.js";
import users from "../models/user.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req,res)=>{
    console.log("api hit")
try{
    const{fullName,userName,email,password} = req.body
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return res.status(400).json({error:'Invalid email format'})
    }

    const existingUser =await users.findOne({userName})
    if(existingUser){
        return res.status(400).json({message:'User already exists'})
    }

    const existingEmail = await users.findOne({email})

    if(existingEmail){
        return res.status(400).json({message:'Email already exists'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new users({
       fullName,
       userName,
       email,
       password:hashedPassword
    })

    await newUser.save()
    if(newUser){
        genrateTokenAndSetCookies(newUser._id,res)
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            userName:newUser.userName,
            email:newUser.email,
            follwers:newUser.follower,
            following:newUser.following,
            profileImage:newUser.profileimg,
            coverImage:newUser.coverimg,
            bio:newUser.bio
        })
    }else{
        
        return res.status(401).json({error:"Invalid user data"})
    }
    
}
catch(error){
    console.log('object',error)
    return res.status(500).json({error:"Error in api"})
}}


export const LogIn = async (req,res)=>{
     
    const {userName,password} = req.body

    try{
        const user = await users.findOne({userName})
   
   
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")
    
    if(!user || !isPasswordCorrect){
        return res.status(400).json("Invalid Username or password")
    }

    genrateTokenAndSetCookies(user?._id, res)

    res.status(201).json({
        _id:user._id,
        fullName:user.fullName,
        userName:user.userName,
        email:user.email,
        follwers:user.follower,
        following:user.following,
        profileImage:user.profileimg,
        coverImage:user.coverimg,
        bio:user.bio,
        messgae:"Success"
    })
}catch(error){
    console.log("this error",error)
    return res.status(500).json({message:"Error in login api"})
}
}
export const Logout = async (req,res)=>{
     try{
       res.cookie("jwt","",{maxAge:0})
       res.status(200).json({message:'Logged out success'})
     }catch(error){
        res.status(500).json({message:"Error in logout"})
     }
}

export const getMe = async(req,res)=>{
    try{
      const user = await users.findById(req.user._id).select('-password')
       return res.status(200).json({Userdetails:user})
    }catch(error){
        console.log('Error',error)
       return res.status(500).json({error:"Error in get user api"}) 
    }
}
