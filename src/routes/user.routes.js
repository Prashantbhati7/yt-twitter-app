import { Router } from "express";
import {LoginUser, logoutUser, registeruser,refreshAccessToken} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();


router.route("/").get((req,res)=>{
    res.send(" user route working ");
})


router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverimage",maxCount:1}]),registeruser);
router.route("/login").post(LoginUser);
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-route").post(refreshAccessToken);

export default router;