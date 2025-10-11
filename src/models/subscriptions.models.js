import mongoose, { Schema } from "mongoose";

const Subscriptionschema = new mongoose.Schema({
    Subscriber:{
        type:{type:Schema.Types.ObjectId,ref:"User"},
        default:[]
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

},{timestamps:true})

export default Subscription = mongoose.model("Subscription",Subscriptionschema);