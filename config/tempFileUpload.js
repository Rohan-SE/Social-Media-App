import fs from 'fs'
import path from 'path'
import {moderateImage} from "../config/picPurifyConfig.js"
const __dirname = path.resolve();

async function tempFileUpload(buffer){
    const upload_dir = path.join(process.cwd(),'uploads')
    if(!fs.existsSync(upload_dir)){
        fs.mkdirSync(upload_dir)
    }
    const tempFilePath = path.join(upload_dir,'tempImage.jpeg')
    await fs.promises.writeFile(tempFilePath,buffer)
    const isSafe = await moderateImage(tempFilePath)
    if(!isSafe){
        await fs.promises.unlink(tempFilePath)
        return false
    }else{
        await fs.promises.unlink(tempFilePath)
        return true
    }
}

export {tempFileUpload}