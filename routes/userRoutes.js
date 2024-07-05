import express from 'express'

const userRouter = express.Router()
import upload from '../config/multerConfig.js'
import userController from '../controllers/userController.js'
import {authUser,checkUserIsLogged} from '../middleware/isAuth.js'

userRouter.post('/signup',upload.single("pic"),userController.userSignup)
userRouter.get('/dashboard',authUser,userController.userDashboard)
userRouter.get('/',checkUserIsLogged,userController.userSignupPage)
userRouter.get('/login',checkUserIsLogged,userController.userLoginPage)
userRouter.post('/login',userController.userLogin)
userRouter.get('/logout',authUser,userController.logout)
userRouter.get('/profiles/search',authUser,userController.userProfiles)
userRouter.get('/user/follow/:id',authUser,userController.followUser)
userRouter.get('/view/user/:id',authUser,userController.userProfile)
userRouter.get('/myprofile',authUser,userController.myProfile)
userRouter.get('/myprofile/edit',authUser,userController.myProfileEdit)
userRouter.post('/myprofile/update',authUser,upload.single("pic"),userController.myProfileUpdate)
export default userRouter