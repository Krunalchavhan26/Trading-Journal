import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addAccount } from "../controllers/account.controller.js";


const router = Router();

router.route("/add-account").post(verifyJWT, addAccount)

export default router;

