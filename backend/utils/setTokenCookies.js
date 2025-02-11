const setTokensCookies = (res,accessToken,refreshToken,accessTokenExp,refreshTokenExp) => {
    const accessTokenMaxAge = (accessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
    const refreshTokenAge = (refreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

    // set cookies for access token
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: accessTokenMaxAge
    })

     // set cookies for refresh token
     res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: refreshTokenAge
    })

    // set cookies for is_Auth
    res.cookie('is_auth', true, {
        httpOnly: false,
        secure: false,
        maxAge: refreshTokenAge
    })
}

export default setTokensCookies;