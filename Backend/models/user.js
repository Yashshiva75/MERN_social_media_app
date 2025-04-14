import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    follower: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    password:{
        type:String,
       require:true
    },
    profileimg: {
        type: String,
        default: ""
    },
    coverimg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    likedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        default:[]
    }]
}, { timestamps: true });

const users = mongoose.model("User", userSchema);

export default users;
