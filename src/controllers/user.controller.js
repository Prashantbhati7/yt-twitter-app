import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

import {User} from "../models/users.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/apiResponse.js";

import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";
import mongoose from "mongoose";

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
            $unset:     // This remove the field from document 
            {
                refreshToken:1,
            },
        },
        {
            new:true
        }
    );

    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user loggedOut seccessfully "));

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken        // if it is mobile app case too
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorised request !!");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken){
            throw ApiError(401,"invalid Refresh Token ");
        }
        const user = await User.findById(decodedToken._id);
        if(!user){
            throw ApiError(401,"invalid Refresh Token ");
        }
    
        if (incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refresh token is expired or used ");
        }
        const options = {
            httpOnly:true,
            secure:true,
        }
    
        const {accessToken,newrefreshToken} = await generateAccessAndRefreshToken(user._id);
    
        return res.status(200).cookie("access Token ",accessToken,options).cookie("refreshToken",newrefreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken:newrefreshToken},"Access Token Refreshed "));
    } catch (error) {
        throw new ApiError(401,error?.message 
            || "invalid refresh token "
        )
    }

})

const changePassword = asyncHandler(async(req,res)=>{
    const {oldpassword,newPassword} = req.body      // old and new password given by user 
    const userid = req.user?._id;
    if (!userid) throw ApiError(401,"User not logged in ");
    const user = await User.findById(userid);
    const correctPass = user.isCorrectPass(oldpassword);           // checking if old password entered by user is correct or not 
    if (!correctPass){
        throw new ApiError(401,"Old password Invalid")
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});       // don't want to run other validation while saving the user 
    res.status(200).json(new ApiResponse(200,{},"Password Updated Successfully "))
})

const getCurrUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Current user fetched Successfully "))
})

const UpdateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname,username} = req.body;
    if (!fullname || !username ){
        throw new ApiError(400,"All Fiels are Required ");
    }
    const user =await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                fullname:fullname,
                username:username,
            }
        },
        {new:true}    // new value will get returned 
    ).select("-password")

    return res.status(200).json(new ApiResponse(200,user,"User Details Updated "));
})

const updataAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar File Missing ")
    }
    const Avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!Avatar.url){
        throw new ApiError(401,"Upload while uploading on cloudinary ")
    }
    const user =await User.findByIdAndUpdate(req.user?._id,
        {$set:{
            avatar:Avatar.url,
        }},
        {new:true}
    ).select("-password");
    return res.status(200).json(new ApiResponse(200,user,"avatar is updated "))
})

const updateCover = asyncHandler(async(req,res)=>{
    const coverLocalPath = req.file?.path;
    if (!coverLocalPath) throw new ApiError(400,"Cover Image Missing");
    const coverimage = await uploadOnCloudinary(coverLocalPath);
    if (!coverLocalPath) throw new ApiError(401,"Error While uploading cover image on cloudinary ");
    const user = User.findByIdAndUpdate(req.user?._id,
        {$set:{coverimage:coverimage.url}},
        {new:true} 
    ).select("-password");
    return res.status(200).json(new ApiResponse(200,user,"cover Image Updated "));
})

const getUserChannelProfile  = asyncHandler(async(req,res)=>{
    const {username} = req.params;
    if (!username?.trim()) throw new ApiError(400,"username required ");
    const channel = await User.aggregate([
        {
            $match:{
                username:username.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",     // model name in database 
                localField:"_id",
                foreignField:"channel",     // to get no of subscriber of a channel,this give channel document(anlaogy - object ) with _id 
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",    // To get channel Subscribed To , give document where id matches with subscriber  
                as:"subscribedTo",
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscribers",
                },
                channelSubscribedCount:{
                    $size:"$subscribedTo",
                },
                issubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},    // lookup made feild.field in model Subscription
                        then:true,
                        else:false,
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subscriberCount:1,
                channelSubscribedCount:1,
                issubscribed:1,
                avatar:1,
                coverimage:1,
                email:1,
            }
        }
    ])
    if (!channel?.length){
        throw new ApiError(400,"No channel found ");
    }
    console.log(channel);
    return res.status(200).json(new ApiResponse(200,channel[0],"Channel profile Detail sent Successfully "))
})

const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)      //  here _id:req.user._id will not work because it gives string not id and now we are not performing operations using moongose so it will not auto converted to ObjectId 
            }
        },
        {
            $lookup:{
                from:'videos', // model name
                localField:'watchHistory',
                foreignField:'_id',
                as:'watchedHistory',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'owner',
                            foreignField:'_id',
                            as:'owner',
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        },
        
    ])
    if (!user) return new ApiError(401,"User Not found");
    return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"History Fetched Successfully "))
})

export {registeruser,LoginUser,logoutUser,refreshAccessToken,changePassword,getCurrUser,UpdateAccountDetails,updataAvatar,updateCover,getUserChannelProfile,getWatchHistory};