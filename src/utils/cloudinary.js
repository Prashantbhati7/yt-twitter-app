import { v2 as cloudinary} from "cloudinary"; 
import { error } from "console";
import fs from "fs";             // Node js defalt lib to read write remove etc 


cloudinary.config({
    cloud_name:process.env.CLODINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLODINARY_API_SECRET,
})


const uploadOnCloudinary = async (localfilepath)=>{
    try{
        if (!localfilepath){
            throw error.json({message:"file not found "});
            return null;
        }
        const res = await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto",  
        })      // file has been uploaded 
        console.log("file has been uploaded ",res.url)
        return res;
    }
    catch(error){
        fs.unlinkSync(localfilepath)         // remove locally saved temp file as upload operation failes 
        return null;
    }
}


export {uploadOnCloudinary}