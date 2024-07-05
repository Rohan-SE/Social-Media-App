import User from "../models/userSchema.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Post from "../models/postSchema.js"
import { tempFileUpload } from "../config/tempFileUpload.js"
const userSignup = async(req,res)=>{
    try {
        const {name,email,password,username} = req.body
        if(!name,!email,!password,!username,!req.file){
            req.flash('error',"Please fill all the fields")
            res.redirect('/')
        }else{
            const user = await User.findOne({email})
            if(user){
               req.flash('error','Email is already registered')
               res.redirect('/')
            }else{
                const findUsername = await User.findOne({username})
                if(findUsername){
                    req.flash('error','Username is already taken')
                    res.redirect('/')
                }else{
                    const isSafe = await tempFileUpload(req.file.buffer)
                if(isSafe === false){
                    req.flash('error','Inappropriate Photo Contain Try Again')
                    return res.redirect('/')
                }else{
                    const hash = await bcrypt.hash(password,10)
                const userObj = new User({
                    name,
                    email,
                    password:hash,
                    pic:req.file.buffer,
                    username
                })
    
                await userObj.save()
                const token = jwt.sign({username},process.env.TSECRET)

                res.cookie('token',token,{
                    httpOnly : true,
                    secure : true,
                    sameSite:'Strict'
                })
                res.redirect('/dashboard')
                }

                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const userDashboard = async(req,res)=>{
    const user = await User.findOne({username:req.user.username})
    .populate('following')

    const post_author = [...user.following.map(followingUser=> followingUser._id),user._id]

    const post = await Post.find({user:{$in: post_author}}).populate({
                path:'comments',
                populate:{
                    path:'user'
                }
            },
    ).populate('user').sort({createdAt:-1})
    
    res.render('dashboard',{user,posts:post,error:req.flash('error')})
}

const userSignupPage = (req,res)=>{
    res.render('signup',{error:req.flash('error')})
}

const userProfiles = async(req,res)=>{
    const query = req.query
    const users = await User.find({name:query.search, username:{$ne: req.user.username }})
    const user = await User.findOne({username:req.user.username})
    res.render('profiles',{users,user})
}

const myProfile = async(req,res)=>{
    const user = await User.findOne({username:req.user.username})
    res.render('myProfile',{user})
}

const myProfileEdit = async(req,res)=>{
    const user = await User.findOne({username:req.user.username})
    res.render('myprofileEdit',{user,error:req.flash('error')})
}

const myProfileUpdate = async(req,res)=>{
    try {
        const {name,email,password, newPassword} = req.body;

        const user = await User.findOne({username:req.user.username})
        user.name = name || user.name
        console.log(user.email)
        console.log(email)
        const userEmail = await User.findOne({email:email, _id:{$ne: user._id}})
        if(userEmail) {
            req.flash('error','Email already registered')
            return res.redirect('back')
        }

        user.email = email || user.email
            if(password && newPassword){
                const compare_password = await bcrypt.compare(password,user.password)
                if(!compare_password) {
                    req.flash('error','Passwords does not match')
                    return res.redirect('back')
                }
                user.password = newPassword
            }

            if(req.file && req.file.buffer){
                const isSafe = await tempFileUpload(req.file.buffer)
                if(isSafe === false){
                    req.flash('error','Inappropriate photo contain')
                    return res.redirect('back')
                }else{
                    user.pic = req.file.buffer
                }    
            }
        await user.save()
        return res.redirect('/myprofile')
    } catch (error) {
        console.log(error)
    }
}

const userLoginPage = (req,res)=>{
    res.render('login',{error:req.flash('error')})
}

const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email,!password){
           req.flash('error','Please fill all the field')
           res.redirect('/login')
        }else{
            const user = await User.findOne({email})
            if(!user){
                req.flash('error','User not found')
                res.redirect('/login')
            }else{
                bcrypt.compare(password,user.password,(err,result)=>{
                    if(err){
                        req.flash('error','Something went wrong')
                        return res.redirect('/login')
                    }
                    if(result){
                        const token = jwt.sign({username:user.username},process.env.TSECRET)
                        res.cookie('token',token,{
                            httpOnly : true,
                            secure : true,
                            sameSite:'Strict'
                        })
                        res.redirect("/dashboard")
                    }else{
                        req.flash('error','Email or Password is incorrect')
                        res.redirect('/login')
                    }
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

 const logout = (req,res)=>{
    const token = ""
    res.cookie('token',token,{
        httpOnly : true,
        secure : true,
        sameSite:'Strict'
        
    })
    res.redirect('/login')
 }

 const followUser = async(req,res)=>{
    try {
        const id = req.params.id
        const user = await User.findOne({_id:id})
        const current_user = await User.findOne({username:req.user.username})
        if(user.followers.indexOf(current_user._id) === -1 && current_user.following.indexOf(user._id) === -1){
            user.followers.push(current_user._id)
            current_user.following.push(user._id)
        }else{
            user.followers.splice(user.followers.indexOf(current_user._id),1)
            current_user.following.splice(current_user.following.indexOf(user._id),1)
        }
        await user.save()
        await current_user.save()
        return res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
 }

 const userProfile = async(req,res)=>{
    const id = req.params.id
    const user = await User.findOne({_id:id}).select('-password').populate(
        {
            path:'posts',
            options:{
                sort:{createdAt:-1}
            },
            populate:{
                path:'comments',

                populate:{
                    path:'user'
                }
            }
        }
    )
    const current_user = await User.findOne({username:req.user.username}).select('_id')
    res.render('userProfile',{user,current_user})
 }
const userController = {myProfileUpdate,myProfileEdit,myProfile,userProfile,userSignup,followUser,userDashboard,userSignupPage,userLoginPage,userLogin,logout,userProfiles}

export default userController