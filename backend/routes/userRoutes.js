import express from "express";
import {
  userRegistration,
  verifyEmail,
  userLogin,
  getNewAccessToken,
  userProfile,
  userLogout
} from "../controllers/userController.js";
import passport from "passport";
// import setAuthHeader from "../middlewares/setAuthHeader.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";

const router = express.Router();
// Public Routes
router.post("/register", userRegistration);
router.post("/verify-email", verifyEmail);
router.post("/login", userLogin);
router.post("/refresh-token", getNewAccessToken);

// Protected Routes
router.get(
  "/me",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  userProfile
);
router.post(
    "/logout",
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    userLogout
  );

export default router;
