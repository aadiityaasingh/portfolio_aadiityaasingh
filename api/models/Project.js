import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    tech: {
      type: [String],
      required: [true, "At least one technology is required"],
      default: [],
    },
    github: {
      type: String,
      trim: true,
      default: "",
    },
    live: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      default: "Activity",
    },
    color: {
      type: String,
      default: "from-blue-400 to-cyan-600",
    },
    bgAccent: {
      type: String,
      default: "bg-blue-500/10",
    },
    order: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in hot-reload / serverless environments
export default mongoose.models.Project || mongoose.model("Project", projectSchema);
