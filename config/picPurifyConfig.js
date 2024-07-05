import axios from 'axios'
import FormData from 'form-data'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

async function moderateImage(imagePath){
    try {
        const file = fs.createReadStream(imagePath)
        const url = 'https://www.picpurify.com/analyse/1.1'
        const formData = new FormData();
        formData.append('file_image',file)
        formData.append('API_KEY',`${process.env.PICPURIFY_API_KEY}`)
        formData.append('task','porn_moderation')
        const res = await axios.post(url,formData,{
            headers:{
                'Content-Type':'multipart/form-data',
                'Authorization': `Bearer ${process.env.PICPURIFY_API_KEY}`
            }
        })
        const {final_decision} = res.data;
        if(final_decision === 'KO'){
            return false
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

export {moderateImage}