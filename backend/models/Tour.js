import mongoose from "mongoose";
import { nanoid } from "nanoid";

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  destination: {
    type: String,
    required: [true, "Destination is required"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  joinCode: {
    type: String,
    unique: true,
    default: () => nanoid(8),
  },
  status: {
    type: String,
    enum: ["planning", "active", "completed"],
    default: "planning",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add captain as first member automatically
tourSchema.pre("save", function (next) {
  if (this.isNew && !this.members.some((m) => m.user.equals(this.captain))) {
    this.members.push({ user: this.captain });
  }
  next();
});

// Validate end date is after start date
tourSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error("End date must be after start date"));
  }
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
