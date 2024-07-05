import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const authUser = async(req,res,next)=>{
    const token = req.cookies.token
    if(token){
        jwt.verify(token,process.env.TSECRET,(err,user)=>{
            if(err) res.status(500)
            req.user = user;
            next()
        })
    }else{
        return res.redirect('/login')
    }

}
const checkUserIsLogged = (req,res,next)=>{
    const token = req.cookies.token
    if(token){
        jwt.verify(token,process.env.TSECRET,(err,user)=>{
            if(err) return next()
            return res.redirect('/dashboard');
        })
    }else{
        next()
    }
}

export {authUser,checkUserIsLogged}