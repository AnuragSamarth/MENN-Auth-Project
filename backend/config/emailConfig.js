import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer'

let transpoter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,  // Admin Gmail ID
        pass: process.env.EMAIL_PASS   // Admin Gmail Password
    }
})

export default transpoter