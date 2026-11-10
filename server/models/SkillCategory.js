import mongoose from "mongoose";

const skillCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      default: [],
    },
    icon: {
      type: String,
      default: "Code2",
    },
    color: {
      type: String,
      default: "from-white to-green-400",
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

export default mongoose.models.SkillCategory ||
  mongoose.model("SkillCategory", skillCategorySchema);
