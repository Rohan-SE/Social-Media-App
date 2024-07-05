import express from 'express'
import forgetPassController from '../controllers/forgetPassController.js'
import { checkUserIsLogged } from '../middleware/isAuth.js'

const passRouter = express.Router()

passRouter.get('/forget/password',checkUserIsLogged,forgetPassController.forgetPassPage)
passRouter.post('/forget/password',checkUserIsLogged,forgetPassController.forgetPass)
passRouter.get('/reset/password/otp',checkUserIsLogged,forgetPassController.resetPassOtpPage)
passRouter.post('/reset/password/otp',checkUserIsLogged,forgetPassController.resetPassOtp)
passRouter.get('/reset/new-password',checkUserIsLogged,forgetPassController.newPasswordPage)
passRouter.post('/reset/new-password',checkUserIsLogged,forgetPassController.newPassword)

export default passRouter