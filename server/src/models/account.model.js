import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Account name is required"],
      unique: true,
    },
    type: {
      type: String,
      required: [true, "Account type is required"],
    },
    startingBalance: {
      type: Number,
      required: [true, "Starting balance is required"],
    },
    goal: {
      type: Number,
      required: [true, "Goal is required"],
    },
    accountStatus: {
      type: String,
      enum: ["Not Started", "Active", "Completed", "Paused"],
      default: "Not Started",
      required: true,
    },
    totalTrades: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWins: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCommission: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalNetPnL: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      required: [true, "Current balance is required"],
    },
    winRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    commission: {
        type: Number,
        required: true,
        default: 0
    },
    ownedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderbooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orderbook",
      },
    ],
  },
  { timestamps: true }
);

accountSchema.pre("save", function (next) {
  if (this.totalTrades > 0) {
    this.winRate = (this.totalWins / this.totalTrades) * 100;
  } else {
    this.winRate = 0;
  }

  next();
});



export const Account = mongoose.model("Account", accountSchema);
