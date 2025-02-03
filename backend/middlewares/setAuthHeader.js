import isTokenExpire from "../utils/isTokenExpired.js";

const setAuthHeader = async(req,res,next) => {
   try {
    const accessToken = req.cookies.accessToken;
   //  console.log(accessToken)

    if(accessToken || !isTokenExpire(accessToken)){
      req.header['authorization'] = `Bearer ${accessToken}`
    }
    next()

   } catch (error) {
    console.error('Error adding access token to header:', error.message)
   }
}

export default setAuthHeader;