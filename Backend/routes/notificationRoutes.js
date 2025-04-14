import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { deleteNotification, getNotification } from '../controllers/notificationController.js'
const router = express.Router()

router.get('/',verifyToken,getNotification)
router.delete('/deletenotification/:id',verifyToken,deleteNotification)

export default router