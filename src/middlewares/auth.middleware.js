import asyncHandler from "../utils/asyncHandler";

import { ApiError } from "../utils/apiError";
import jwt  from "jsonwebtoken";

import {User} from "../models/users.model.js";


export const verifyJWT = asyncHandler(async(req,req,next)=>{        // to verify if user is authenticated or not 
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");            // custom header for case of mobile application 
    
    
        if (!token){
            throw new ApiError(401,"")
        }
        const decoded_token =  jwt.verify(token,ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decoded_token?._id).select("-password -refreshToken");
    
        if (!user) {
            throw new ApiError(401,"invalid Access token");
        }
    
        req.user = user;
    
        next()
    } catch (error) {
        throw new ApiError(402,error?.message || "error in verifying jwt token ");
    };

})