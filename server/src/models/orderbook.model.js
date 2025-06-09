import { model, Schema } from "mongoose";
import { Account } from "./account.model.js";
import { ApiError } from "../utils/ApiError.js";

const orderbookSchema = new Schema(
  {
    pair: {
      type: String,
      required: true,
    },
    open: {
      type: Date,
      required: [true, "Open date and time is required"],
    },
    close: {
      type: Date,
      required: [true, "Close date and time is required"],
    },
    direction: {
      type: String,
      enum: ["Long", "Short"],
      required: true,
    },
    session: {
      type: String,
      enum: ["Asia", "London", "New York"],
      required: true,
    },
    lotSize: {
      type: Number,
      required: true,
    },
    tradeStatus: {
      type: String,
      enum: [
        "Open",
        "Closed by Take Profit",
        "Closed by Stop Loss",
        "Closed Manually",
      ],
      required: true,
    },
    grossPnL: {
      type: Number,
    },
    commission: {
      type: Number,
      required: true,
      default: 0,
    },
    netPnL: {
      type: Number,
    },
    result: {
      type: String,
      enum: ["Profit", "Loss"],
    },
    risk: {
      type: Number,
      required: true,
    },
    confluence: {
      type: String,
      required: false,
    },
    tradeImage: {
      type: String,
      default: "",
    },
    entry: {
      type: Number,
    },
    exit: {
      type: Number,
    },
    analysis: {
      type: String,
    },
    resultReview: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

orderbookSchema.pre("save", async function (next) {
  try {
    if (
      !this.isModified("grossPnL") &&
      !this.isModified("lotSize")
    ) {
      return next();
    }
    const account = await Account.findById(this.account);
    if (!account) return next(new ApiError(400, "Invalid account reference"));

    const commisionPerLot = account.commission || 0;
    this.commision = this.lotSize * commisionPerLot;

    if (this.grossPnL !== null) {
      this.netPnL = this.grossPnL - this.commision;
      this.result = this.netPnL > 0 ? "Profit" : "Loss";
    }

    next();
  } catch (error) {
    next(
      new ApiError(500, "Something went wrong during commission calculation")
    );
  }
});

export const Orderbook = model("Orderbook", orderbookSchema);
