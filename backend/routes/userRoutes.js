import express from "express";
import {userRegistration,verifyEmail,userLogin} from '../controllers/userController.js';


const router = express.Router();
// Public Routes
router.post('/register', userRegistration)
router.post('/verify-email', verifyEmail)
router.post("/login",userLogin)

export default router;