import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    purpose: String,
    splitWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
