import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";
import { Orderbook } from "../models/orderbook.model.js";

const addAccount = asyncHandler(async (req, res) => {
  const { name, type, startingBalance, goal, commission } = req.body;

  if (
    [name, type, startingBalance, goal, commission].some(
      (field) =>
        field === null || field === undefined || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const alreadyExists = await Account.findOne({
    name: name,
    ownedBy: req.user._id,
  });

  if (alreadyExists) {
    throw new ApiError(409, "Account with this name already exists");
  }

  const account = await Account.create({
    name,
    type,
    startingBalance,
    goal,
    commission,
    currentBalance: startingBalance, // Initially same as starting
    ownedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, account, "Account created successfully"));
});

const editAccount = asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const { name, type, startingBalance, goal, accountStatus, commission } =
    req.body;

  const account = await Account.findOne({
    _id: accountId,
    ownedBy: req.user._id,
  });

  if (!account) throw new ApiError(404, "Account not found or accessable");

  // only update the provided fields
  if (name !== undefined) account.name = name;
  if (type !== undefined) account.type = type;
  if (goal !== undefined) account.goal = goal;
  if (accountStatus !== undefined) account.accountStatus = accountStatus;
  if (commission !== undefined) account.commission = commission;

  if (startingBalance !== undefined) {
    if (account.totalTrades === 0) {
      account.startingBalance = startingBalance;
      account.currentBalance = startingBalance;
    } else {
      throw new ApiError(
        400,
        "Cannot update starting balance after trades have been placed"
      );
    }
  }

  await account.save();

  return res
    .status(200)
    .json(new ApiResponse(200, account, "Account updated successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findOne({
    _id: accountId,
    ownedBy: req.user._id,
  });

  if (!account) throw new ApiError(404, "Account not found or not accessible");

  await Orderbook.deleteMany({ account: account._id });

  await account.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account and related orderbooks deleted"));
});

const getAllAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ ownedBy: req.user._id }).select(
    "-orderbooks"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, accounts, "Accounts fetched successfully"));
});

const getSingleAccount = asyncHandler(async (req, res) => {
  const { accountId } = req.params;

  if (!accountId) {
    throw new ApiError(400, "Account ID is required");
  }

  const account = await Account.findById(accountId);

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, account, "Account fetched successfully"));
});

export {
  addAccount,
  editAccount,
  deleteAccount,
  getAllAccounts,
  getSingleAccount,
};
