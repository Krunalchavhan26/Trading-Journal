import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addAccount,
  deleteAccount,
  editAccount,
  getAllAccounts,
  getSingleAccount,
} from "../controllers/account.controller.js";

const router = Router();

router.route("/add-account").post(verifyJWT, addAccount);
router.route("/edit-account/:accountId").patch(verifyJWT, editAccount);
router.route("/delete-account/:accountId").delete(verifyJWT, deleteAccount);

router.route("/getAllAccounts").get(verifyJWT, getAllAccounts);
router.get("/get-single-account/:accountId", verifyJWT, getSingleAccount);

export default router;
