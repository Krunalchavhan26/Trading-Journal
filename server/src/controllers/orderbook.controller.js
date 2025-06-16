import { Account } from "../models/account.model.js";
import { Orderbook } from "../models/orderbook.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  if(!accountId) throw new ApiError(400, "accountId is required");

  if (
    [pair, open, direction, session, lotSize, tradeStatus, risk, entry].some(
      (field) =>
        field === null || field === undefined || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  let tradeImageLocalPath = req.file ? req.file.path : ""
  let tradeImage = "";

  if(tradeImageLocalPath) {
    const response = await uploadOnCloudinary(tradeImageLocalPath);
    tradeImage = response?.url || ""
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
    account: accountId
  })

  return res.status(200).json(new ApiResponse(201, orderbook, "Orderbook entry created successfully"));
});

export { addOrderbook };
