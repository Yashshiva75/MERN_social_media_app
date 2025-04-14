import express from 'express'
import { getMe, LogIn, Logout, SignUp } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/signup',SignUp)
router.post('/login',LogIn)
router.post('/logout',Logout)
router.get('/me',verifyToken,getMe)

export default router