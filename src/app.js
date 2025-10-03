import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));


app.use(express.static("public"))      // To store some images,pdf in local folder 

app.use(cookieParser())

//Route import 

import userRoute from "./routes/user.routes.js";

app.use("/api/v1/user",userRoute);

export {app};