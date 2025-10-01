// const dotenv = require("dotenv");
import connection from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({

});




connection();






// import { db_name } from "./constants";
// import express from "express";
// const app = express();

// const main =async ()=>{
//     try{
//     await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);
//     app.listen(process.env.PORT,()=>{
//         console.log("app is listening to port ",process.env.PORT);
//     })
//     } 
//     catch(error){
//         console.log("error :",error);
//     }
// }

// main().then(()=>{
//     console.log("connected to Db successfullly ");
// }).catch((error)=>{
//     console.log("error is connection with databasee ",error);
// })