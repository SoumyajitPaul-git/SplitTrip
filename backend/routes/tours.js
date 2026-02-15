import express from "express";
import {
  createTour,
  getTours,
  getTour,
  joinTour,
  updateTourStatus,
  getTourReport,
} from "../controllers/tourController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTours).post(createTour);

router.route("/:id").get(getTour);

router.route("/join/:joinCode").post(joinTour);

router.route("/:id/status").patch(updateTourStatus);

router.route("/:id/report").get(getTourReport);

export default router;
