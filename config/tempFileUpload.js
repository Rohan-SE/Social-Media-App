import fs from 'fs'
import path from 'path'
import {moderateImage} from "../config/picPurifyConfig.js"
const __dirname = path.resolve();

async function tempFileUpload(buffer){
    const tempFilePath = path.join('/tmp','tempImage.jpeg')
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