import { Account } from "../models/account.model.js";
import { Orderbook } from "../models/orderbook.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  getPublicIdFromUrl,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const addOrderbook = asyncHandler(async (req, res) => {
  const {
    pair,
    open,
    close,
    direction,
    session,
    lotSize,
    tradeStatus,
    grossPnL,
    risk,
    confluence,
    entry,
    exit,
    analysis,
    resultReview,
  } = req.body;

  const { accountId } = req.params;

  if (!accountId) throw new ApiError(400, "accountId is required");

  if (
    [pair, open, direction, session, lotSize, tradeStatus, risk, entry].some(
      (field) =>
        field === null || field === undefined || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  let tradeImageLocalPath = req.file ? req.file.path : "";
  let tradeImage = "";

  if (tradeImageLocalPath) {
    const response = await uploadOnCloudinary(tradeImageLocalPath);
    tradeImage = response?.url || "";
  }

  const orderbook = await Orderbook.create({
    pair,
    open,
    close,
    direction,
    session,
    lotSize,
    tradeStatus,
    grossPnL,
    risk,
    confluence,
    entry,
    exit,
    analysis,
    resultReview,
    tradeImage,
    user: req.user._id,
    account: accountId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(201, orderbook, "Orderbook entry created successfully")
    );
});

const editOrderbook = asyncHandler(async (req, res) => {
  const { orderbookId, accountId } = req.params;

  if (!orderbookId || !accountId) {
    throw new ApiError(400, "orderbookId and accountId are required");
  }

  const orderbook = await Orderbook.findOne({
    _id: orderbookId,
    account: accountId,
    user: req.user._id,
  });

  if (!orderbook) {
    throw new ApiError(404, "Orderbook not found");
  }

  const allowedFields = [
    "pair",
    "open",
    "close",
    "direction",
    "session",
    "lotSize",
    "tradeStatus",
    "grossPnL",
    "risk",
    "confluence",
    "entry",
    "exit",
    "analysis",
    "resultReview",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      orderbook[field] = req.body[field];
    }
  }

  if (req.file) {
    // Delete the old image from cloudinary if exist
    if (orderbook.tradeImage) {
      const publicId = getPublicIdFromUrl(orderbook.tradeImage);
      await deleteFromCloudinary(publicId);
    }

    // Upload new image
    const response = await uploadOnCloudinary(req.file.path);
    orderbook.tradeImage = response.url;
  }

  await orderbook.save();

  return res
    .status(200)
    .json(new ApiResponse(200, orderbook, "Orderbook updated successfully"));
});

export { addOrderbook, editOrderbook };
