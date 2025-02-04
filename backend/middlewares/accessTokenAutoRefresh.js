// This middleware will set Authorization Header and will refresh access token on expire.
// if we user this middleware we won't have to explicitly make request to refresh-token api url.

import isTokenExpire from "../utils/isTokenExpired.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import setTokensCookies from "../utils/setTokenCookies.js";

const accessTokenAutoRefresh = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    //  console.log(accessToken)

    if (accessToken || !isTokenExpire(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }

    if (!accessToken || isTokenExpire(accessToken)) {
      // Attempt to get a new access token using the refresh token
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        // If refresh token is also missing, throw an error
        throw new Error("Refresh token is missing");
      }

      // Access token is expired, make a refresh token request
      const {newAccessToken, newRefreshToken, newAccessTokenExp,newRefreshTokenExp} = await refreshAccessToken(req, res);

      // set cookies
      setTokensCookies(res, newAccessToken,newRefreshToken,newAccessTokenExp, newRefreshTokenExp)

      // Add the access token to the Authorization header
      req.headers['authorization'] = `Bearer ${newAccessToken}`
    }
    next();
  } catch (error) {
    console.error("Error adding access token to header:", error.message);
  }
};

export default accessTokenAutoRefresh;
