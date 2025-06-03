import express from "express";
import {
  createTour,
  joinTour,
  getUserTours,
} from "../controllers/tourController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTour);
router.get("/join/:link", verifyToken, joinTour);
router.get("/my-tours", verifyToken, getUserTours);
router.get("/:tourId/report", verifyToken, getTourReport);

export default router;
