import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import passport from 'passport';
import userRoutes from './routes/userRoutes.js'
import './config/passport-jwt-startegy.js'
import setTokensCookies from './utils/setTokenCookies.js';
import './config/google-startegy.js'

dotenv.config()
const app = express()
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//This will solved CORS Policy Error Solved
const corsOptions = {
    // set origin to a specific origin
    origin: process.env.FRONTEND_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Database Connection
connectDB(DATABASE_URL);

// JSON
app.use(express.json())

// Passport Middeware
app.use(passport.initialize())

// cookies parsers
app.use(cookieParser()) 

// load routes
app.use("/api/user", userRoutes)

// Google Auth Routes
app.get('/auth/google',
    passport.authenticate('google', { session: false , scope: ['profile'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', {session: false, failureRedirect: `${process.env.FRONTEND_HOST}/account/login` }),
    function(req, res) {
      // Access user object and token from req.user
      const {user, accessToken,refreshToken, accessTokenExp,refreshTokenExp} = req.user;
      setTokensCookies(res,accessToken,refreshToken,accessTokenExp,refreshTokenExp)

      // Successful authentication, redirect home.
      res.redirect(`${process.env.FRONTEND_HOST}/user/profile`);
    });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})