import express from 'express'
import { LogIn, Logout, SignUp } from '../controllers/authController.js'

const router = express.Router()

router.get('/signup',SignUp)
router.post('/login',LogIn)
router.post('/logout',Logout)

export default router