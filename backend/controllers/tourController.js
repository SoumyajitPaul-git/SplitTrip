import Tour from "../models/Tour.js";
import { v4 as uuidv4 } from "uuid";
import Expense from "../models/Expense.js";


export const getTourReport = async (req, res) => {
  try {
    const { tourId } = req.params;

    const tour = await Tour.findById(tourId).populate("members", "name");
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    const expenses = await Expense.find({ tour: tourId });

    const report = {};
    tour.members.forEach((member) => {
      report[member._id] = {
        name: member.name,
        paid: 0,
        share: 0,
      };
    });

    let total = 0;

    for (const expense of expenses) {
      total += expense.amount;

      // Add paid amount
      if (report[expense.paidBy]) {
        report[expense.paidBy].paid += expense.amount;
      }

      const splitAmong = expense.splitWith;
      const splitAmount = expense.amount / splitAmong.length;

      for (const userId of splitAmong) {
        if (report[userId]) {
          report[userId].share += splitAmount;
        }
      }
    }

    const finalReport = Object.entries(report).map(([userId, data]) => ({
      userId,
      name: data.name,
      paid: data.paid,
      share: parseFloat(data.share.toFixed(2)),
      balance: parseFloat((data.paid - data.share).toFixed(2)),
    }));

    res.json({
      tourId,
      totalExpenses: total,
      members: finalReport,
    });
  } catch (err) {
    console.error("Report Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


export const createTour = async (req, res) => {
  try {
    const { name, description, location, startDate, endDate } = req.body;
    const tour = await Tour.create({
      name,
      description,
      location,
      startDate,
      endDate,
      createdBy: req.user.id,
      members: [req.user.id],
      joinLink: uuidv4(),
    });
    res.status(201).json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinTour = async (req, res) => {
  try {
    const tour = await Tour.findOne({ joinLink: req.params.link });
    if (!tour) return res.status(404).json({ message: "Invalid link" });

    if (!tour.members.includes(req.user.id)) {
      tour.members.push(req.user.id);
      await tour.save();
    }
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserTours = async (req, res) => {
  try {
    const tours = await Tour.find({ members: req.user.id });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
