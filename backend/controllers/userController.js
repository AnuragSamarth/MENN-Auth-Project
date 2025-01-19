import UserModel from "../models/User.js";
import bcrypt from "bcrypt";

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

export default userRegistration;