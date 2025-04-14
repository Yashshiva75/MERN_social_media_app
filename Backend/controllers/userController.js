import Notification from "../models/notificationSchema.js"
import users from "../models/user.js"
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from 'cloudinary'

export const getUserProfile = async (req,res)=>{
    const {username} = req.params
    
    try{
     const user = await users.findOne({userName:username}).select("-password")
       
     if(!user){
        return res.status(401).json({error:'User not found'})
     }

     return res.status(200).json({message:user})
    }catch(error){
        console.log("Error",error)
        return res.status(500).json({error:'Error catch user not found'})
    }
}

export const followUnfollow = async (req,res)=>{
    const {id} = req.params
    try{
     const user = users.findById({id})
     const userToModify =await users.findById(id)
     
     const currUser =await users.findById(req.user._id)

     if(id === req.user._id.toString()){
        return res.status(401).json({error:'You can follow - Unfollow yourself'})
     }

     if(!userToModify || !currUser){
        return res.status(401).json({error:'User id not found'})
     }

     const isFollowing = currUser.following.includes(id)

     if(isFollowing){
        //Unfollow
        await users.findByIdAndUpdate(id,{$pull:{follower:req.user._id}})
        await users.findByIdAndUpdate(req.user._id,{$pull:{following:id}})
        const newNotification = new Notification({
         type:"Unfollow",
         from:req.user._id,
         to:userToModify
        })
        await newNotification.save()
        return res.status(200).json({message:"User unfollowed success"})
     }else{
        await users.findByIdAndUpdate(id,{$push:{follower:req.user._id}})
        await users.findByIdAndUpdate(req.user._id,{$push:{following:id}})
        //Send notification
        const newNotification = new Notification({
         type:"follow",
         from:req.user._id,
         to:userToModify
        });
        await newNotification.save()
        return res.status(200).json({message:"User followed success"})
     }

     
    }catch(error){
        console.log("Error",error)
        return res.status(500).json({error:'Error catch user not found'})
    }
}

export const getSuggestedUser = async (req,res)=>{
   try{
      const userId = req.user._id

      const usersFollowedByMe = await users.findById(userId).select("following")

      const user = await users.aggregate([
         {
            $match:{
               _id:{$ne:userId},
            },
         },{$sample:{size:10}}
      ])

      const filteredUsers = user.filter((val)=>!usersFollowedByMe.following.includes(val._id))
      const suggesstedUsers = filteredUsers.slice(0,4)

      suggesstedUsers.forEach((user)=>(user.password = null))
      return res.status(200).json(suggesstedUsers)

   }catch(error){
      console.log('object',error)
        return res.status(500).json({error:"error"})  
   }
}

export const updateUserProfile = async (req,res)=>{
   const {fullName,userName,email,currentpassword,newpassword,bio,link} = 
   req.body
   let {profileimg,coverimg} = req.body

   const userId = req.user._id

   try{

    let user = await users.findById(userId)

    if(!user){
      return res.status(401).json({error:'User not found'})
    }

    if((!newpassword && currentpassword) || (newpassword && !currentpassword)){
      return res.status(401).json({error:'Both Passwords are must'})
    }

    if(newpassword && currentpassword){
      const verify = await bcrypt.compare(currentpassword,user.password)
       if(!verify){
         return res.status(400).json({error:'old password not matched'})
       }
       if(newpassword.length > 6){
         return res.status(400).json({error:'Password must be atlease 6 char long'})
       }
       const gensalt = await bcrypt.genSalt(10)
       user.password = await bcrypt.hash(newpassword,gensalt)
      }

      if(profileimg){
        if(user.profileimg){
           await cloudinary.uploader.destroy(user.profileimg.split('/').pop().split(".")[0])
        }
        const uploadedImg = await cloudinary.uploader.upload(profileimg)
        profileimg = uploadedImg.secure_url
        
      }
      if(coverimg){
        if(user.coverimg){
           await cloudinary.uploader.destroy(user.coverimg.split('/').pop().split(".")[0])
        }
        const uploadedImg = await cloudinary.uploader.upload(coverimg)
        coverimg = uploadedImg.secure_url
        
      }
      
      user.fullName = fullName || user.fullName,
      user.email = email || user.email,
      user.userName = userName || user.userName,
      user.bio = bio || user.bio,
      user.link = link || user.link,
      user.profileimg = profileimg || user.profileimg,
      user.coverimg = profileimg || user.coverimg

      user = await user.save()
      user.password = null

      return res.status(200).json({message:"Profile updated successfully"})
   }catch(error){
      console.log('err',error)
      return res.status(500).json({message:"Error in update"})

   }
}