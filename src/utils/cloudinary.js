import { v2 as cloudinary} from "cloudinary"; 
import fs from "fs";             // Node js defalt lib to read write remove etc 
import { ApiError } from "./apiError.js";


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localfilepath)=>{
   // console.log("file path for cloudinary is ",localfilepath);
   try {
        if (!localfilepath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        
        fs.unlinkSync(localfilepath)
        console.log("uploaded on cloudinary ",localfilepath);
        
        return response;
    }  catch (error) {
        console.log("errot on uploading on clodinary ",localfilepath);
        fs.unlinkSync(localfilepath) // remove the locally saved temporary file as the upload operation got failed
        return null;
}

}


export {uploadOnCloudinary}