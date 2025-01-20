import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOtp.js";
import EmailVerificationModel from "../models/emailVerification.js";
import generateTokens from "../utils/generateTokens.js";
import setTokensCookies from "../utils/setTokenCookies.js";

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
    if(password !== password_confirmation){
        return res.status(400).json({status: "failed", message: "Password and Confirm Password don't match"})
    }

    // check if email already exists
    const existingUser = await UserModel.findOne({email});
    if(existingUser) {
        return res.status(409).json({status: "failed", message: "Email already exixts"})
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    // console.log(salt)
    const hashedPassword = await bcrypt.hash(password,salt);

    // create new user
    const newUser = await new UserModel({name,email,password:hashedPassword}).save();
     
    // send verification otp mail
    sendEmailVerificationOTP(req,newUser)

    // send success response
    res.status(201).json({
        status: "success",
        message: "Registration Success",
        user: {id: newUser._id, email: newUser.email}
    })


  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Unable to register, please try again later",
      });
  }
};

// User Email Verification
const verifyEmail = async (req, res) => {
   try {
     // Extract request body parameters
     const {email,otp} = req.body;

    if(!email || !otp){
      return res.status(400).json({status: "failed", message: "All fields are required"})
    }

    // Check if email doesn't exixts
    const existingUser = await UserModel.findOne({email});
    if(!existingUser) {
      return res.status(404).json({status: "failed", message: "Email doesn't exists"})
    }

    // Check if email is already verified
    if(existingUser.is_verified) {
      return res.status(400).json({status: "failed", message: "Email is already verified"});
    }

    // Check if there is matching email verification OTP
    const emailVerification = await EmailVerificationModel.findOne({userId: existingUser._id, otp});
    if(!emailVerification){
      if(!existingUser.is_verified){
        await sendEmailVerificationOTP(req, existingUser);
        return res.status(400).json({status: 'failed', message: "Invalid OTP, new OTP sent to your email."})
      }
      return res.status(400).json({status: "failed", message: "Invalid OTP"})
    }
    
    // Check if OTP is expired
    const currentTime = new Date();
    // 10 * 60 * 1000 calculate the expiration period in millisecond(10 minutes).
    const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
    if(currentTime > expirationTime){
      // OTP expired, send new OTP
      await sendEmailVerificationOTP(req,existingUser);
      return res.status(400).json({status: "failed", message: "OTP expired new OTP send to your email"})
    }

    // OTP is valid and not expired, mark email as verified
    existingUser.is_verified = true;
    await existingUser.save()

    await EmailVerificationModel.deleteMany({userId: existingUser._id});
    return res.status(200).json({status: "success", message:"Email verified successfully"})

   } catch (error) {
    console.log(error);
    res.status(500).json({status: "failed", message: "Unable to verify email, please try again."})
   }
}


const userLogin = async (req, res) => {
   try {
    const{email, password} = req.body;
    // Check if emai and password are provided
    if(!email || !password){
      return res.status(400).json({status: "failed", message: "Email and password are required"})
    }
     
    // Find user by email
    const user = await UserModel.findOne({email});

    // Check if user exist
    if(!user){
      return res.status(404).json({status: "failed", message: "Invalid email or password"})
    }

    // Check if user exixts
    if(!user.is_verified){
      return res.status(401).json({status: "failed", message: "Your account is not verified"})
    }

    // Compare password / Check Password
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(401).json({status: "failed", message: "Invalid email or password"})
    }
 
    // Generate tokens
    const {accessToken,refreshToken,accessTokenExp,refreshTokenExp} = await generateTokens(user)

    // Set Cookies
    setTokensCookies(res,accessToken,refreshToken,accessTokenExp,refreshTokenExp)    

    // Send Success Response with Tokens
    res.status(200).json({
      user: {id: user._id, email: user.email, name: user.name, roles: user.role},
      status: "success",
      message: "Login successful",
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_exp: accessTokenExp,
      is_auth: true
    })

   } catch (error) {
    console.log(error)
    res.status(500).json({status: "failed", message: "Unable to login, Please try again."})
   }
}


export {userRegistration,verifyEmail, userLogin};