import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
    comment:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
})

const Comment = mongoose.model('comment',commentSchema,'comments')

export default Comment