import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";


import {User} from "../models/users.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/apiResponse.js";

const registeruser = asyncHandler(async(req ,res)=>{
    console.log(req.body);
    const {username,email,fullname,password} = req.body;

    //validation 

    if (fullname=="") {
        throw  new ApiError(400,"username required")
    }
    if ([email,username,password].some((field)=> field?.trim()=== "" )){
        throw new ApiError(400,"requirement of data not meet ");
    }
    //console.log(`username :${username} email :${email} fullname : ${fullname}`)

    // check if user already exists 

    const found = user.findOne({
        $or:[{email},{username}]
    })
    
    if (found){
        throw new ApiError(409,"user already Exists");
    }

    // check is images avatar exists 
    avatarLocalPath = req.files?.avatar[0]?.path
    coverimageLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) throw ApiError(400,"file not found ");

    //upload to cloudinary   
    const avatar = await uploadOnCloudinary(avatarLocalPath);     // cloudinary middleware sending res we want res.url
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);

    if (!avatar) throw new ApiError(400,"cloudinary upload error ")


    // Add into database 
    const dbresponse = await User.create({                           // error will be handled by asyncHandler but we need to wait as database is in another continent 
        fullname,   
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
        username:username.toLowerCase(),
        email,
        password,
    })

    const userRegistered = await User.findById(dbresponse._id).select("-password -refreshToken");

    if (!userRegistered) throw new ApiError(400,"user not registered , db error ");

    return res.status(200).json(new ApiResponse(200,userRegistered,"user registedred successfully ! "))


    return res.status(200).json({message:"succesfully Registered !! "});
})


export {registeruser,};