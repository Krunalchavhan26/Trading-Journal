import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addAccount, editAccount } from "../controllers/account.controller.js";


const router = Router();

router.route("/add-account").post(verifyJWT, addAccount)
router.route("/edit-account/:accountId").patch(verifyJWT, editAccount);

export default router;

