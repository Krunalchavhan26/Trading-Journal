import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addOrderbook, editOrderbook } from "../controllers/orderbook.controller.js";

const router = Router();

router
  .route("/add-orderbook/:accountId")
  .post(verifyJWT, upload.single("tradeImage"), addOrderbook);

router
  .route("/edit-orderbook/:accountId/:orderbookId")
  .put(verifyJWT, upload.single("tradeImage"), editOrderbook);

export default router;
