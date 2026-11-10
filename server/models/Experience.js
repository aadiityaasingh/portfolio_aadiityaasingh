import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date range is required"],
      trim: true,
    },
    points: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Experience ||
  mongoose.model("Experience", experienceSchema);
