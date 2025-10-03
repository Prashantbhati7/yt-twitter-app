import { Router } from "express";
import {registeruser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();


router.route("/").get((req,res)=>{
    res.send(" user route working ");
})


router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverimage",maxCount:1}]),registeruser);


export default router;