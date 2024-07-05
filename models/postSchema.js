
import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    caption:String,
    content:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    like:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comment'
        }
    ],
    pic:Buffer,
    createdAt: {
        type:Date,
        default:Date.now
    }
})

const Post = mongoose.model('post',postSchema,'posts')

export default Post