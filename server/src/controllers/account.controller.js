import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";

const addAccount = asyncHandler(async (req, res) => {
  const { name, type, startingBalance, goal, commission } =
    req.body;

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
    ownedBy: req.user._id
  })

  if(alreadyExists) {
    throw new ApiError(409, "Account with this name already exists");
  }

  const account = await Account.create({
    name,
    type,
    startingBalance,
    goal,
    commission,
    currentBalance: startingBalance, // Initially same as starting
    ownedBy: req.user._id
  })

  return res.status(201).json(new ApiResponse(201, account, "Account created successfully"))
});

export {addAccount};
