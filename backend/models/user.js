import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email : {type: String, required: true, trim: true, unique: true, lowercase: true},
    password: {type: String, required: true, trim: true},
    // password_confirmation: {type: String, required: true},
    is_verified: {type: Boolean, default: false},
    role: {type: String, enum: ['user', 'admin'], default:'user'}
})

// Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel