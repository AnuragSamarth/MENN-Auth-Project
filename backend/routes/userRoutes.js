import express from "express";
import {
  userRegistration,
  verifyEmail,
  userLogin,
  getNewAccessToken,
  userProfile,
  userLogout,
  chnageUserPassword,
  sendUserPasswordResetEmail,
  userPasswordReset
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
router.post("/reset-password-link", sendUserPasswordResetEmail);
router.post("/reset-password/:id/:token", userPasswordReset)


// Protected Routes
router.get(
  "/me",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  userProfile
);
router.post(
  "/change-password",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  chnageUserPassword
);
router.post(
  "/logout",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  userLogout
);

export default router;
