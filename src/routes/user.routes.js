import { Router } from "express";
import {LoginUser, logoutUser, registeruser,refreshAccessToken,test, changePassword, getCurrUser, UpdateAccountDetails, updataAvatar, updateCover, getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();


router.route("/").get((req,res)=>{
    res.send(" user route working ");
})


router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverimage",maxCount:1}]),registeruser);
router.route("/login").post(LoginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/test").post(test);
router.route("/refresh-route").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/curruser").get(verifyJWT,getCurrUser)
router.route("/update-account").patch(verifyJWT,UpdateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updataAvatar);
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateCover);
router.route("/watch-history").get(verifyJWT,getWatchHistory);
router.route("/c/:username").get(verifyJWT,getUserChannelProfile);
export default router;