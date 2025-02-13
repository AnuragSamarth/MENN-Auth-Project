import UserModel from "../models/user.js";
import UserRefreshTokenModel from "../models/userRefreshToken.js";
import generateTokens from "./generateTokens.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async(req,res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        // Verify Refresh token is valid or not
      const {tokenDetails,error} = await verifyRefreshToken(oldRefreshToken)
   
      if(error){
        res.status(401).send({status: "failed", message: "Invalid refresh token"})
      }

      // Find User based on Refresh token detail id
      const user = await UserModel.findById(tokenDetails._id);

      if(!user){
        res.status(404).send({status: "failed", message: "User not found"})
      }

      const userRefreshToken = await UserRefreshTokenModel.findOne({userId: tokenDetails._id})
      
      if(oldRefreshToken !== userRefreshToken.token){
        return res.status(401).send({status: "failed", message: "Unauthorized access"})
      }

      // Generate tokens
    const {accessToken,refreshToken,accessTokenExp,refreshTokenExp} = await generateTokens(user);

    return {
        newAccessToken: accessToken,
        newRefreshToken: refreshToken,
        newAccessTokenExp: accessTokenExp,
        newRefreshTokenExp: refreshTokenExp
    }
      
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal server error"})
    }
}

export default refreshAccessToken;