import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import expenseRoutes from "./routes/expenses.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => res.send("SplitTrip Backend Running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
