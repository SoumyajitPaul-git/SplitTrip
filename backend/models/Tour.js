import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    location: String,
    startDate: Date,
    endDate: Date,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joinLink: String,
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
