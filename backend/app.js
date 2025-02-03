import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import passport from 'passport';
import userRoutes from './routes/userRoutes.js'
import './config/passport-jwt-startegy.js'

dotenv.config()
const app = express()
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//This will solved CORS Policy Error Solved
const corsOptions = {
    // set origin to a specific origin
    origin: process.env.FRONTEND_HOST,
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


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})