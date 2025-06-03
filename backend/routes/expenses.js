import express from "express";
import {
  addExpense,
  getTourExpenses,
} from "../controllers/expenseController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addExpense);
router.get("/:tourId", verifyToken, getTourExpenses);

export default router;
