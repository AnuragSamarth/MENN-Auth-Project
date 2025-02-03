import express from "express";
import {userRegistration,verifyEmail,userLogin,getNewAccessToken, userProfile} from '../controllers/userController.js';
import passport from "passport";
import setAuthHeader from "../middlewares/setAuthHeader.js";

const router = express.Router();
// Public Routes
router.post('/register', userRegistration)
router.post('/verify-email', verifyEmail)
router.post("/login",userLogin)
router.post("/refresh-token", getNewAccessToken)

// Protected Routes
router.get("/me", setAuthHeader , passport.authenticate('jwt', {session:false}) , userProfile)

export default router;