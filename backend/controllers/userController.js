import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOtp.js";
import EmailVerificationModel from "../models/emailVerification.js";
import generateTokens from "../utils/generateTokens.js";
import setTokensCookies from "../utils/setTokenCookies.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import transpoter from "../config/emailConfig.js";
import jwt from "jsonwebtoken"

// user registration
const userRegistration = async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;
    // console.log(password_confirmation)

    //Check if all required fields are provided
    if (!name || !email || !password || !password_confirmation) {
      return res
        .status(400)
        .json({ status: "failed", message: "All field are required" });
    }

    // Check if the password and password_confirmation match
    if (password !== password_confirmation) {
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Password and Confirm Password don't match",
        });
    }

    // check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "failed", message: "Email already exixts" });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    // console.log(salt)
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await new UserModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    // send verification otp mail
    sendEmailVerificationOTP(req, newUser);

    // send success response
    res.status(201).json({
      status: "success",
      message: "Registration Success",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Unable to register, please try again later",
    });
  }
};

// User Email Verification
const verifyEmail = async (req, res) => {
  try {
    // Extract request body parameters
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    // Check if email doesn't exixts
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: "failed", message: "Email doesn't exists" });
    }

    // Check if email is already verified
    if (existingUser.is_verified) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email is already verified" });
    }

    // Check if there is matching email verification OTP
    const emailVerification = await EmailVerificationModel.findOne({
      userId: existingUser._id,
      otp,
    });
    if (!emailVerification) {
      if (!existingUser.is_verified) {
        await sendEmailVerificationOTP(req, existingUser);
        return res
          .status(400)
          .json({
            status: "failed",
            message: "Invalid OTP, new OTP sent to your email.",
          });
      }
      return res.status(400).json({ status: "failed", message: "Invalid OTP" });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    // 10 * 60 * 1000 calculate the expiration period in millisecond(10 minutes).
    const expirationTime = new Date(
      emailVerification.createdAt.getTime() + 15 * 60 * 1000
    );
    if (currentTime > expirationTime) {
      // OTP expired, send new OTP
      await sendEmailVerificationOTP(req, existingUser);
      return res
        .status(400)
        .json({
          status: "failed",
          message: "OTP expired new OTP send to your email",
        });
    }

    // OTP is valid and not expired, mark email as verified
    existingUser.is_verified = true;
    await existingUser.save();

    await EmailVerificationModel.deleteMany({ userId: existingUser._id });
    return res
      .status(200)
      .json({ status: "success", message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Unable to verify email, please try again.",
      });
  }
};

// user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if emai and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email and password are required" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    // Check if user exist
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "Invalid email or password" });
    }

    // Check if user exixts
    if (!user.is_verified) {
      return res
        .status(401)
        .json({ status: "failed", message: "Your account is not verified" });
    }

    // Compare password / Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);

    // Set Cookies
    setTokensCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    // Send Success Response with Tokens
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.role,
      },
      status: "success",
      message: "Login successful",
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_exp: accessTokenExp,
      is_auth: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Unable to login, Please try again.",
      });
  }
};

// Get New Access Token Or Refresh Token
const getNewAccessToken = async (req, res) => {
  try {
    // Get new access token using refresh token
    const {
      newAccessToken,
      newRefreshToken,
      newAccessTokenExp,
      newRefreshTokenExp,
    } = await refreshAccessToken(req, res);

    // Set New token to cookie
    setTokensCookies(
      res,
      newAccessToken,
      newRefreshToken,
      newAccessTokenExp,
      newRefreshTokenExp
    );

    res.status(200).send({
      status: "success",
      message: "New token generated",
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      access_token_exp: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Unable to generate new token, please try again later.",
      });
  }
};

// Profile OR Logged in User
const userProfile = async (req, res) => {
  res.send({ user: req.user });
};

// Logout
const userLogout = async (req, res) => {
  try {
    // Clear access token and refresh token cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("is_auth");

    res.status(200).json({ status: "success", message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Unable to logout, please try again later",
      });
  }
};

// Change Password
const chnageUserPassword = async (req,res) => {
   try {
    const {password,password_confirmation} = req.body;

    // Check if both password and password_confirmation are provided
    if(!password || !password_confirmation){
      return res.status(400).json({status: "failed", message: "Password and Confirm Password are required"})
    }

    // Check if password and password_confirmation match
    if(password !== password_confirmation){
      return res.status(400).json({status: "failed", message: "New password and confirm new password don't match."})
    }

    // Generate salt and hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password,salt)

    // Update user password
    await UserModel.findByIdAndUpdate(req.user._id, {$set : {password: newHashPassword}})

    // send success response
    res.status(200).json({status: "success", message: "Password change successfully"})

   } catch (error) {
    console.error(error);
    res.status(500).json({status: "failed", message: "Unable to change password, please try again later."})
   }
}

// Send Password Reset Link via Email
const sendUserPasswordResetEmail = async (req,res) => {
   try {
    const {email} = req.body;
      
    // Check if email is provided
    if(!email){
      return res.status(400).json({status: "failed", message: "Email field is required."})
    }
     
    // Find user by email
    const user = await UserModel.findOne({email});
    if(!user){
      return res.status(404).json({status: "failed", message: "Email doesn't exixt"})
    }
    
    // Generate token for password reset
    const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
    const token = jwt.sign({userID: user._id}, secret, {expiresIn: "15m"})

    // Reset Link
    const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;

    // Send password reset email
    await transpoter.sendMail({
      from : process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Link",
      html: `<p>Hello ${user.name},</p><p>Please <a href="${resetLink}">Click here</a> to reset your password.</p>`
    })

    res.status(200).json({status: "success", message: "Password reset email sent. please check your email."})

   } catch (error) {
    console.error(error);
    res.status(500).json({status: "failed", message: "Unable to send password reset email. Please try again later."})
   }
}

// Password Reset
const userPasswordReset = async (req,res) =>{
   try {
    const {password,password_confirmation} = req.body;

    // Check if password and password_confirmation are provided
    if(!password || !password_confirmation){
      return res.status(400).json({status: "failed", message: "New Password and Confirm New Password are required."})
    }

    // Check if password and password_confirmation match
    if(password !== password_confirmation){
      return res.status(400).json({status: "failed", message: "New Password and Confirm New Password don't match."})
    }

    const {id,token} = req.params;
    // Find user by ID
    const user = await UserModel.findById(id);
    if(!user){
      return res.status(404).json({status: "failed", message: "User not found"})
    }
    // Validate token
    const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
    jwt.verify(token, new_secret);

    // generate salt and hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password,salt);

    // Update user's password
    await UserModel.findByIdAndUpdate(user._id, {$set: {password: newHashPassword}});

    // Send success response
    res.status(200).json({status: "success", message: "Password reset successfully."})

   } catch (error) {
    console.error(error)
    return res.status(500).json({status: "failed", message: "Unable to reset password. Please try again later."})
   }
}

export {
  userRegistration,
  verifyEmail,
  userLogin,
  getNewAccessToken,
  userProfile,
  userLogout,
  chnageUserPassword,
  sendUserPasswordResetEmail,
  userPasswordReset,
};
