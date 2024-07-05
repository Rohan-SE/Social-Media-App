import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DB_HOST

const dbConn = async()=>{
    try {
        await mongoose.connect(uri,{useNewUrlParser: true,useUnifiedTopology: true})
        console.log("Mongodb Connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default dbConn