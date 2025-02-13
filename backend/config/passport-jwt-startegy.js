import UserModel from "../models/user.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";

let otps = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
};

passport.use(
  new JwtStrategy(otps, async function (jwt_payload, done) {
    try {
        const user = await UserModel.findOne({ _id: jwt_payload._id }).select('-password')
        if(user){
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (error) {
        return done(error, false)
    }
  })
);
