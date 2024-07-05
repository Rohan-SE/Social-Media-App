import express from 'express'
import {authUser} from '../middleware/isAuth.js'
import postController from '../controllers/postController.js'
import upload from '../config/multerConfig.js'

const postRouter = express.Router()

postRouter.post('/user/create/post',authUser,upload.single('pic'),postController.postCreate)
postRouter.post('/user/post/:id/comment',authUser,postController.commenting)
postRouter.get('/user/post/edit/:id',authUser,postController.postUpdatePage)
postRouter.post('/user/post/edit/:id',authUser,upload.single('pic'),postController.postUpdate)
postRouter.get('/user/post/delete/:id',authUser,postController.postDelete)
postRouter.get('/user/post/comment/delete/:id',authUser,postController.commentDelete)
postRouter.get('/user/post/:id/like',authUser,postController.postLike)

export default postRouter;