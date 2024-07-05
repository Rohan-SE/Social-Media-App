import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    username:String,
    otpSecret:String,
    otpExpiry:Date,
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ],
    followers: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    following: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    pic:Buffer
})

const User = mongoose.model('user',userSchema,'users')

export default User