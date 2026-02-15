import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be positive"],
  },
  category: {
    type: String,
    enum: [
      "food",
      "transport",
      "accommodation",
      "entertainment",
      "shopping",
      "other",
    ],
    default: "other",
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  splitType: {
    type: String,
    enum: ["equal", "custom"],
    default: "equal",
  },
  customSplits: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: Number,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validate participants are not empty
expenseSchema.pre("save", function (next) {
  if (!this.participants || this.participants.length === 0) {
    next(new Error("At least one participant is required"));
  }
  next();
});

// Validate paidBy is in participants
expenseSchema.pre("save", function (next) {
  if (!this.participants.some((p) => p.equals(this.paidBy))) {
    this.participants.push(this.paidBy);
  }
  next();
});

// Validate custom splits sum equals amount
expenseSchema.pre("save", function (next) {
  if (this.splitType === "custom" && this.customSplits.length > 0) {
    const total = this.customSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    if (Math.abs(total - this.amount) > 0.01) {
      next(new Error("Custom splits must sum to total amount"));
    }
  }
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
