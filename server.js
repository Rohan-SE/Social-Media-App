import express from 'express'
import cors from 'cors'
import flash from 'connect-flash'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import path from 'path';
import dbConn from './config/dbConfig.js'
import userRouter from './routes/userRoutes.js'
import postRouter from './routes/postRoutes.js'
import passRouter from './routes/fPassRoutes.js'



const app = express()
const __dirname = path.resolve();
dotenv.config()
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(cookieParser())
app.use(flash())
app.use(userRouter)
app.use(postRouter)
app.use(passRouter)
const port = 4200
dbConn().then(()=>{
    app.listen(port,()=>{
    })
})