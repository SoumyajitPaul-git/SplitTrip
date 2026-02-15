import express from "express";
import {
  createExpense,
  getExpensesByTour,
  getExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createExpense);

router.route("/tour/:tourId").get(getExpensesByTour);

router.route("/:id").get(getExpense).put(updateExpense).delete(deleteExpense);

export default router;
