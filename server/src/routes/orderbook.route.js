import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addOrderbook,
  deleteOrderbook,
  editOrderbook,
} from "../controllers/orderbook.controller.js";

const router = Router();

router
  .route("/add-orderbook/:accountId")
  .post(verifyJWT, upload.single("tradeImage"), addOrderbook);

router
  .route("/edit-orderbook/:accountId/:orderbookId")
  .put(verifyJWT, upload.single("tradeImage"), editOrderbook);

router.route("/orderbook/:orderbookId").delete(verifyJWT, deleteOrderbook);

export default router;
