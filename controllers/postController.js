import Post from "../models/postSchema.js"
import User from "../models/userSchema.js"
import Comment from "../models/commentSchema.js"
import { tempFileUpload } from "../config/tempFileUpload.js"



const postCreate = async(req,res)=>{
    try {
        const {caption,content} = req.body
        if(!caption,!content,!req.file){
            req.flash('error','Please fill all the fields')
            res.redirect('/dashboard')
        }else{
            const user = await User.findOne({username:req.user.username})
            const isSafe = await tempFileUpload(req.file.buffer)
            if(isSafe===false){
                req.flash('error','Inappopriate Photo Contain Try Again')
                return res.redirect('/dashboard')
            }else{
                const postObj = new Post({
                    user:user._id,
                    caption,
                    content,
                    pic:req.file.buffer
                })
               const post = await postObj.save()
                user.posts.push(post._id)
                await user.save()
                return res.redirect('/dashboard')
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const commenting  = async(req,res)=>{
    try {
        const postId = req.params.id
        const {comment} = req.body
        if(!comment){
            res.redirect('/dashboard')
        }else{
            const post = await Post.findOne({_id:postId})
            const user = await User.findOne({username:req.user.username})
            const commentObj = new Comment({
                comment,
                user:user._id,
                post:post._id
            })
            const commented = await commentObj.save()
            post.comments.push(commented._id)
            await post.save()
            return res.redirect('/dashboard')
        }
    } catch (error) {
        console.log(error)
    }
}

const postUpdate = async(req,res)=>{
    try {
        const id = req.params.id
        const {caption,content} = req.body
        const post = await Post.findOne({_id:id})
        const user = await User.findOne({username:req.user.username})
        if(post.user._id.toString() === user._id.toString()){
            post.content = content || post.content
            post.caption = caption || post.caption
            if(req.file && req.file.buffer){
                const isSafe = await tempFileUpload(req.file.buffer)
                if(isSafe === false){
                    req.flash('error','Inappopriate Photo Contain')
                    return res.redirect('back')
                }else{
                    post.pic = req.file.buffer
                }    
            }
            await post.save()
            return res.redirect('/dashboard')
        }
        return res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
}

const postUpdatePage = async(req,res)=>{
    const id = req.params.id 
    const post = await Post.findOne({_id:id})
    const user = await User.findOne({username:req.user.username})
    if(post.user._id.toString() === user._id.toString()){
        res.render('postUpdate',{post,user,error:req.flash('error')})
    }else{
        res.redirect('/dashboard')
    }
}

const postDelete = async(req,res)=>{
    try {
        const id = req.params.id
        const post = await Post.findOne({_id:id})
        const user = await User.findOne({username:req.user.username})
        if(post.user._id.toString() === user._id.toString()){
            await post.deleteOne()
            await Comment.deleteMany({post:post._id})
            user.posts.splice(user.posts.indexOf(post._id),1)
            await user.save()
            return res.redirect('/dashboard')
        }
    } catch (error) {
        console.log(error)
    }
}

const commentDelete = async(req,res)=>{
try {
    const id = req.params.id 
    const comment = await Comment.findOne({_id:id})
    const user = await User.findOne({username:req.user.username})
    if(comment.user._id.toString() === user._id.toString()){
        const post = await Post.findOne({_id:comment.post._id})
        await comment.deleteOne()
        post.comments.splice(post.comments.indexOf(comment._id),1)
        await post.save()
        return res.redirect('/dashboard')
    }
} catch (error) {
    console.log(error)
}
}

const postLike = async(req,res)=>{
    try {
        const id = req.params.id
        const user = await User.findOne({username:req.user.username})
        const post = await Post.findOne({_id:id})
        if(post.like.indexOf(user._id)=== -1){
            post.like.push(user._id)
        }else{
            post.like.splice(post.like.indexOf(user._id),1)
        }
        await post.save()
        return res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
}

const postController = {postUpdatePage,postCreate,commenting,postUpdate,postDelete,commentDelete,postLike}

export default postController;