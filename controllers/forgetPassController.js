import User from "../models/userSchema.js"
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
const forgetPassPage = async (req,res)=>{
    res.render('forgetPass',{error:req.flash('error')})
}

const forgetPass = async (req,res)=>{
    try {
        const {email,username} = req.body
        if(!email,!username){
            req.flash('error','Please fill Email & Username')
            res.redirect('back')
        }else{
            const user = await User.findOne({email,username})
            if(!user){
                req.flash('error','User not found')
                res.redirect('back')
            }else{
                const otpGenerate = Math.floor(100000 + Math.random()*900000)
                user.otpSecret = otpGenerate.toString()
                user.otpExpiry = new Date(Date.now() + 10*60000)
                await user.save()
                const smtp = nodemailer.createTransport({
                    host: 'smtp-mail.outlook.com',
                    port:587,
                    secure:false,
                    auth:{
                        user:"forgetPassreset900@outlook.com",
                        pass:`${process.env.EMAILPASS}`
                    }
                })
                const mailOptions = {
                    to:user.email,
                    from:'forgetPassreset900@outlook.com',
                    subject:'Password Reset OTP',
                    text:`Your OTP for password reset is ${otpGenerate} it expires in 10 mins and do not share with anyone`
                }
                await smtp.sendMail(mailOptions)
                return res.redirect('/reset/password/otp')
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const resetPassOtpPage = async (req,res)=>{
    res.render('resetPass',{error:req.flash('error')})
}

const resetPassOtp = async (req,res)=>{
    try {
        const {otp} = req.body;
        const validateOtp = await User.findOne({otpSecret:otp}).select('email')
        if(!validateOtp){
            req.flash('error','Invalid OTP')
            res.redirect('back')
        }else{
            if(validateOtp.otpExpiry < new Date()){
                req.flash('error','OTP is Expired')
                res.redirect('back')
            }else{
                req.session.user = validateOtp
                return res.redirect('/reset/new-password')
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const newPasswordPage = (req,res)=>{
    res.render('newPassword',{error:req.flash('error')})
}

const newPassword = async (req,res)=>{
    try {
        const {password,confirm_password} = req.body
        if(!password,!confirm_password){
            req.flash('error','Please fill all the fields')
            res.redirect('back')
        }else{
            if(password!=confirm_password){
                req.flash('error','Password does not match')
                res.redirect('back')
            }else{
                const email = req.session.user
                const user = await User.findOne({email:email.email})
                if(!user){
                    req.flash('error','something went wrong')
                    res.redirect('back')
                }else{
                    const hashPass = await bcrypt.hash(password,10)
                    user.password = hashPass
                    await user.save()
                    req.session.user = null
                    return res.redirect('/')
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const forgetPassController = {forgetPassPage,forgetPass,resetPassOtpPage,resetPassOtp,newPasswordPage,newPassword}

export default forgetPassController