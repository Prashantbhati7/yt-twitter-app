import mongoose from "mongoose";
import { db_name } from "../constants.js";

const connection = async ()=>{
    try{
        const result = await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);
        console.log( `MongoDb connected !! DB Host : ${result.connection.host}`);
    }
    catch(error){
        console.log("error :",error);
    }
}

export default connection;