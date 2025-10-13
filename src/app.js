import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
console.log("app.js" , process.env.FRONTEND_URL)



app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));


app.use(express.static("public"))      // To store some images,pdf in local folder 

app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("working server");
})
//Route import 

import userRoute from "./routes/user.routes.js";
import tweetRoute from "./routes/tweet.routes.js";
import playlistRoute from "./routes/playlist.routes.js";
import subscriptionRoute from "./routes/subscribption.routes.js";
import videoRoute from "./routes/video.routes.js";
import likeRoute from "./routes/like.routes.js";
import commentRoute from "./routes/comment.routes.js";


app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet",tweetRoute);
app.use("/api/v1/subscription",subscriptionRoute);
app.use("/api/v1/playlist",playlistRoute);
app.use("/api/v1/video",videoRoute);
app.use("/api/v1/like",likeRoute);
app.use("/api/v1/comment",commentRoute);

export {app};