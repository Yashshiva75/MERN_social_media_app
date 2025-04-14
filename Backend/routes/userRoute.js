import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { followUnfollow, getSuggestedUser, getUserProfile, updateUserProfile } from '../controllers/userController.js'
const router = express()

router.get("/profile/:username",verifyToken,getUserProfile)
router.get("/suggested",verifyToken,getSuggestedUser)
router.post("/follow/:id",verifyToken,followUnfollow)
router.post("/update/:id",verifyToken,updateUserProfile)


export default router;