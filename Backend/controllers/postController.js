import Notification from '../models/notificationSchema.js';
import posts from '../models/postSchema.js'
import users from '../models/user.js'
import {v2 as cloudinary} from 'cloudinary'

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const user = req.user._id.toString();

        if (!user) return res.status(401).json({ error: 'User not found' });

        if (!text && !img) {
            return res.status(400).json({ error: 'Provide at least text or img' });
        }

        let uploadedRes;
        if (img) {
            uploadedRes = await cloudinary.uploader.upload(img);
        }

        const newPost = new posts({
            user,
            text,
            img: uploadedRes?.secure_url || null
        });

        await newPost.save();
        return res.status(201).json({message: 'Post created successfully',post:newPost});
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ error: 'Error in API' });
    }
};

export const deletePost = async (req,res) => {
    try{
    const {id} = req.params
    const postId = await posts.findById(id)
      
    if(!postId){
        return res.status(401).json({error:'Post not found'})
    }
    if(postId.user.toString()!==req.user._id.toString()){
        return res.status(401).json({error:'YOU CANT DELETE THIS POST'})
    }
    if(postId.img){
        const imgId = postId.img.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(imgId)
    }

    await posts.findByIdAndDelete(req.params.id) 
    return res.status(200).json({message:'post deleted success'})
}catch(error){
    console.log('Error',error)
}
}

export const commentOnPost = async (req,res) =>{
    try{
    const {id} = req.params
    const {text} = req.body
    const userId = req.user._id.toString()
    const post = await posts.findById(id)
    if(!post){
        return res.status(401).json({error:'Post not found'})
    }

    const comment = {user:userId,text}
    post.comment.push(comment);

    await post.save()
    return res.status(200).json({message:'Comment added successfully'})
    }catch(error){
        console.log('object',error)
        return res.status(500).json({error:"Error in api"})
    }
    
}

export const LikeDislikePost = async (req,res) =>{
    const {id} = req.params
    const userId = req.user._id.toString()

    try{
         const post = await posts.findById(id)
            if(!post){
                return res.status(401).json({error:'Post not found'})
            }
            const isLiked = post.likes.includes(userId)
            if(isLiked){
                await post.updateOne({$pull:{likes:userId}})
                await users.updateOne({_id:userId},{$pull:{likedPosts:id}})
                return res.status(200).json({message:'Post disliked successfully'})
            }
            await post.updateOne({$push:{likes:userId}})
            await users.updateOne({_id:userId},{$push:{likedPosts:id}})
            const newNotification = await Notification({
                from:userId,
                to:post.user,
                type:'like'
            })
            await newNotification.save()
            return res.status(200).json({message:'Post liked successfully'})
    }catch(error){
        console.log('Error',error)
        return res.status(500).json({error:'Error in API'})
    }
}

export const getAllPosts = async(req,res)=>{
console.log("api hit")
    try{
        const post = await posts.find().sort({createdAt:-1}).populate({path:"user",select:"-password"})
        
        if(post.length === 0){
            return res.status(200).json([])
        }

        return res.status(200).json(post)
    }catch(error){
        console.log('Error',error)
        return res.status(200).json(posts)
    }

}

export const getLikedPOsts = async (req,res)=>{
    const {userId} = req.params
    try{
      const likedPosts = await users.findById(userId)
      if(!likedPosts){
        return res.status(400).json({message:'posts not found'})
      }
      const likedpost = await posts.find({_id:{$in:likedPosts.likedPosts}})
      .populate({path:"user",select:"-password"})
      
      return res.status(200).json(likedpost)
    }catch(error){

    }
}

export const getFollowingPosts = async(req,res)=>{
    
    
    try{
        const userId = req.user._id
        const user = await users.findById(userId)
        if (!user) return res.status(404).json({ error: "User not found" });

         const following = user.following
         const post = await posts.find({user:{$in:following}}).sort({createdAt:-1})
         .populate({path:"user",select:"-password"})
         .populate({path:"comment.user",select:"-password"})
         return res.status(200).json(post)
    }catch(error){
        console.log(error)
        return res.status(500).json({error:'Error in api'})
    }
}

export const getUserPosts = async(req,res)=>{
    const {username} = req.params
    try{
      const user = await users.findOne({userName:username})
      
      if(!user){
        return res.status(401).json({error:"user not found"})
      }
      const post = await posts.find({user:user._id}).sort({createdAt:-1})
      .populate({
        path:"user",
        select:"-password"
      }).populate({
        path:"comment.user",
        select:"-password"
      })
     
      return res.status(200).json(post)
    }catch(error){
        console.log('object',error)
       return res.status(500).json({message:"Error in api"})
    }
}