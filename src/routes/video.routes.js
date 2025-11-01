import { Router } from "express";

const router = Router();

router.route("/").get(getallvideos);



export default router;