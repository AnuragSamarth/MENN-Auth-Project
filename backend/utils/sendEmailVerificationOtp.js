import transpoter from "../config/emailConfig.js"
import EmailVerificationModel from "../models/emailVerification.js";

const sendEmailVerificationOTP = async(req,user) => {
      // Generate a random 4-digit number
      const otp = Math.floor(1000 + Math.random() * 9000);

      // Save OTP in Database
      await new EmailVerificationModel({userId: user._id, otp: otp}).save();

      //OTP Verification Link
      const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`
      
      await transpoter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "OTP - Verify your account",
        html: `<p>Dear ${user.name}, Thank you for signing up with our service. To complete your registration, please verify your email address by entering the following OTP:<h3>${otp}</h3></p> 
        <p>This OTP is valid for 10 minutes.</p>`
      })
   return otp
}

export default sendEmailVerificationOTP