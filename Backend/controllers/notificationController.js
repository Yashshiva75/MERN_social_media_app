import Notification from "../models/notificationSchema.js"


export const getNotification = async(req,res)=>{
     const userId = req.user._id
       
     try{
        const notification = await Notification.find({to:userId}).populate({
            path:"from",
            select:"userName profileimg"
        })
       
        await Notification.updateMany({to:userId},{read:true})
        res.status(200).json(notification)
     }catch(error){
        console.log('object',error)
        res.status(500).json({message:"Error in api"})
     }
}

export const deleteNotification = async(req,res)=>{
        const userId = req.user._id
        const {id} = req.params
        try{
         const notification = await Notification.findById(id)
         if(!notification){
            return res.status(400).json({error:"notification not found"})
         }
         if(notification.to.toString() !== userId.toString()){
            return res.status(401).json({error:"you cant delete this notification"})
         }
         await Notification.findByIdAndDelete(id)

         return res.status(200).json({message:"Notifications deleted"})
        }catch(error){
         console.log(error)
         return res.status(500).json({message:"Error in api"})
        }
}