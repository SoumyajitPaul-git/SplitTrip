import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const { tourId, amount, purpose, splitWith } = req.body;
    const expense = await Expense.create({
      tour: tourId,
      paidBy: req.user.id,
      amount,
      purpose,
      splitWith,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getTourExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ tour: req.params.tourId })
      .populate("paidBy", "name")
      .populate("splitWith", "name");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
