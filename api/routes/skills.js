import express from "express";
import { connectDB } from "../lib/db.js";
import SkillCategory from "../models/SkillCategory.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const INITIAL_SKILL_CATEGORIES = [
  {
    category: "Languages",
    icon: "Code2",
    skills: ["JavaScript", "Java", "Python", "SQL"],
    description: "The foundation of logic and scripting.",
    color: "from-white to-green-400",
    order: 0,
  },
  {
    category: "Web & Backend",
    icon: "Globe",
    skills: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Socket.IO",
      "RESTful API",
      "Tailwind",
    ],
    description: "Modern full-stack architecture.",
    color: "from-gray-200 to-blue-500",
    order: 1,
  },
  {
    category: "Tools & Deployment",
    icon: "Cpu",
    skills: [
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "Vercel",
      "NPM",
      "Render",
      "Swagger",
    ],
    description: "Development tools and deployment platforms.",
    color: "from-gray-300 to-red-500",
    order: 2,
  },
  {
    category: "Infrastructure",
    icon: "Layers",
    skills: ["MongoDB", "Mongoose", "MySQL", "Redis", "cloudinary"],
    description: "Deployment, Cloud & CI/CD.",
    color: "from-white to-gray-500",
    order: 3,
  },
];

// GET: Fetch all skill categories (Public)
router.get("/", async (req, res) => {
  try {
    await connectDB();

    const count = await SkillCategory.countDocuments();
    if (count === 0) {
      console.log("Seeding initial skill categories into MongoDB...");
      await SkillCategory.insertMany(INITIAL_SKILL_CATEGORIES);
    }

    const categories = await SkillCategory.find().sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return res.status(200).json({
      success: false,
      message: "Database connection failed, using fallback skills",
      error: error.message,
      data: INITIAL_SKILL_CATEGORIES,
    });
  }
});

// POST: Create a new skill category (Admin)
router.post("/", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { category, description, skills, icon, color } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const lastCategory = await SkillCategory.findOne().sort({ order: -1 });
    const order = lastCategory && typeof lastCategory.order === "number" ? lastCategory.order + 1 : 0;

    const formattedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newCategory = new SkillCategory({
      category: category.trim(),
      description: description || "",
      skills: formattedSkills,
      icon: icon || "Code2",
      color: color || "from-white to-green-400",
      order,
    });

    const saved = await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Skill category created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating skill category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create skill category",
      error: error.message,
    });
  }
});

// PUT: Update a skill category (Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { category, description, skills, icon, color, order } = req.body;

    const formattedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    const updateData = {
      ...(category && { category: category.trim() }),
      ...(description !== undefined && { description }),
      ...(formattedSkills && { skills: formattedSkills }),
      ...(icon && { icon }),
      ...(color && { color }),
      ...(order !== undefined && { order }),
    };

    const updated = await SkillCategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Skill category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating skill category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update skill category",
      error: error.message,
    });
  }
});

// DELETE: Delete a skill category (Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const deleted = await SkillCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Skill category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill category deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting skill category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete skill category",
      error: error.message,
    });
  }
});

// PATCH: Reorder skill categories (Admin)
router.patch("/reorder", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        message: "orderedIds must be an array of IDs.",
      });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await SkillCategory.bulkWrite(bulkOps);
    }

    const reordered = await SkillCategory.find().sort({ order: 1 });

    return res.status(200).json({
      success: true,
      message: "Skill categories reordered successfully",
      data: reordered,
    });
  } catch (error) {
    console.error("Error reordering skills:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reorder skill categories",
      error: error.message,
    });
  }
});

export default router;
