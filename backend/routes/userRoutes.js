import express from "express";
import {userRegistration,verifyEmail,userLogin,getNewAccessToken} from '../controllers/userController.js';


const router = express.Router();
// Public Routes
router.post('/register', userRegistration)
router.post('/verify-email', verifyEmail)
router.post("/login",userLogin)
router.post("/refresh-token", getNewAccessToken)

export default router;