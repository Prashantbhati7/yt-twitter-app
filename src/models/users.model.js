import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { useDebugValue } from "react";
const userschema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required: true,
        
       
        trim:true,
        index:true
    },
    avatar:{
        type:String,            //url 
        required: true,
        // unique:true,
        // lowercase:true,
        // trim:true,
        // index:true,
    },
    coverimage:{
        type:String
    },
    watchHistory:{         // npm i mongoose-aggregate-paginate-v2
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        }]
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true})

userschema.pre("save",async function(next){
    if (this.isModified("password")){
        this.password = bcrypt.hash(this.password,10);
    }
    next();
})       // not arrow function because we want this reference here 


userschema.methods.isCorrectPass = async function(password){          // To check if password is correct or not 
    return await bcrypt.compare(password,this.password);
}

userschema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,                       //Payload 
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userschema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,                       //Payload 
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userschema);