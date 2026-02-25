import { response } from "express";
import {v2 as cloudinary} from cloudinary
import {fs} from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: CLOUDINARY_CLOUD_API_SECRET
})

const uploadFile = async function(localFilePath){
    try{
        if(!localFilePath){
            return null;
        }
        cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        console.log("file is uploaded on cloudinary" , response.url);
        return response
    }catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temporary 
        // file as the upload operation got failed

    }
}