import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

import { upload } from "../middlewares/multer.middleware.js";

import {User} from "../models/users.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/apiResponse.js";



const generateAccessAndRefreshToken = async(userId)=>{
    try{    
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshoken();


        // saving refresh token of that particular user in database 

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {refreshToken,accessToken};

    }catch(error){
        throw new ApiError(500,"there is an error while generating access token and refresh token. ");
    }
}



const registeruser = asyncHandler(async(req ,res)=>{
    //console.log(req.body);


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

    const found = await User.findOne({
        $or:[{email},{username}]
    })
    
    if (found){
        throw new ApiError(409,"user already Exists");
    }

    //console.log(req.files);
    const  avatarLocalPath = req.files?.avatar[0]?.path
    let coverimageLocalPath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0 ) coverimageLocalPath = req.files.coverimageLocalPath[0].path; 


    // console.log("avatatlocalpath ",avatarLocalPath);
    // console.log("coverimageLocalPath ",coverimageLocalPath);

    if (!avatarLocalPath) throw ApiError(400,"file not found ");


    const avatar = await uploadOnCloudinary(avatarLocalPath);     // cloudinary middleware sending res we want res.url
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);

    if (!avatar) throw new ApiError(400,"cloudinary upload error ")


    // Add into database 
    const dbresponse = await User.create({                           // error will be handled by asyncHandler but we need to wait as database is in another continent 
        fullname,   
        avatar:avatar.url,
        coverimage:coverimage?.url ||"",
        username:username.toLowerCase(),
        email,
        password,
    })

    const userRegistered = await User.findById(dbresponse._id).select("-password -refreshToken");

    if (!userRegistered) throw new ApiError(400,"user not registered , db error ");

    console.log(`${username} registered successfully !!`)

    return res.status(200).json(new ApiResponse(200,userRegistered,"user registedred successfully ! "))
})


const LoginUser = asyncHandler(async(req,res)=>{
    const {email,username,password} = req.body;
    if (!username && !email){
        throw new ApiError(400,"username or email required ");
    }
    const existinguser =await User.findOne({$or:[{username},{email}]});
    if (!existinguser) {
        throw new ApiError(400,"No user with these credential exists,try sign up ");
    }

    const isvalid = await existinguser.isCorrectPass(password);
    if (!isvalid) throw new ApiError(401,"password is wrong ");

    const {refreshToken,accessToken} = await generateAccessAndRefreshToken(existinguser._id);


    // to send to user without password and refreshtoken 
    const loggedinUser = await User.findById(existinguser._id).select("-password -refreshToken");
    
    // to send cookies 
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200).cookie("accessToken ",accessToken,options).cookie("refreshToken ",refreshToken,options).json(
        new ApiResponse(200,{       //json response totaly upto you what and how you want to send things 
            user:loggedinUser,accessToken,refreshToken       // sending accesstoken , referesh token to user if 
        },"user Logged in successfully ! ")
    );

})


const logoutUser = asyncHandler(async(req,res)=>{          // we need to create a middleware to logout user 
    await User.findByIdAndUpdate(req.user._id,
        {
        $set:
        {
        refreshToken:undefined
        },
    },{new:true});

    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user loggedOut seccessfully "));

})

export {registeruser,LoginUser,logoutUser};