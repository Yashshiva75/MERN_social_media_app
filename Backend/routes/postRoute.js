import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getUserPosts, LikeDislikePost } from '../controllers/postController.js';
const router = express.Router()

router.get('/getallpost',verifyToken,getAllPosts)
router.post('/getlikedpost/:id',verifyToken,getAllPosts)
router.get('/following',verifyToken,getFollowingPosts)
router.post('/getusergposts/:username',verifyToken,getUserPosts)
router.post('/createpost',verifyToken,createPost)
router.post('/commentonpost/:id',verifyToken,commentOnPost)
router.post('/likeDislikepost/:id',verifyToken,LikeDislikePost)
router.delete('/deletepost/:id',verifyToken,deletePost)


export default router;