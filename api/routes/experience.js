import express from "express";
import { connectDB } from "../lib/db.js";
import Experience from "../models/Experience.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const INITIAL_EXPERIENCES = [
  {
    role: "Frontend Developer Intern",
    company: "RungtaTech, Bhilai",
    date: "Jan 24 - Jan 25",
    points: [
      "Developed and maintained responsive web interfaces using HTML, CSS, and JavaScript, ensuring cross-browser compatibility and usability.",
      "Integrated REST APIs and dynamic content with backend services while optimizing frontend rendering to improve application performance and user experience.",
    ],
    order: 0,
  },
];

// GET: Fetch all experiences (Public)
router.get("/", async (req, res) => {
  try {
    await connectDB();

    const count = await Experience.countDocuments();
    if (count === 0) {
      console.log("Seeding initial experiences into MongoDB...");
      await Experience.insertMany(INITIAL_EXPERIENCES);
    }

    const list = await Experience.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return res.status(200).json({
      success: false,
      message: "Database connection failed, using fallback experience data",
      error: error.message,
      data: INITIAL_EXPERIENCES,
    });
  }
});

// POST: Add new experience (Admin)
router.post("/", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { role, company, date, points } = req.body;

    if (!role || !company || !date) {
      return res.status(400).json({
        success: false,
        message: "Role, company, and date are required.",
      });
    }

    const lastExp = await Experience.findOne().sort({ order: -1 });
    const order = lastExp && typeof lastExp.order === "number" ? lastExp.order + 1 : 0;

    const formattedPoints = Array.isArray(points)
      ? points.filter(Boolean)
      : typeof points === "string"
      ? points.split("\n").map((p) => p.trim()).filter(Boolean)
      : [];

    const newExperience = new Experience({
      role: role.trim(),
      company: company.trim(),
      date: date.trim(),
      points: formattedPoints,
      order,
    });

    const saved = await newExperience.save();

    return res.status(201).json({
      success: true,
      message: "Experience added successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating experience:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create experience",
      error: error.message,
    });
  }
});

// PUT: Update experience (Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { role, company, date, points, order } = req.body;

    const formattedPoints = Array.isArray(points)
      ? points.filter(Boolean)
      : typeof points === "string"
      ? points.split("\n").map((p) => p.trim()).filter(Boolean)
      : undefined;

    const updateData = {
      ...(role && { role: role.trim() }),
      ...(company && { company: company.trim() }),
      ...(date && { date: date.trim() }),
      ...(formattedPoints !== undefined && { points: formattedPoints }),
      ...(order !== undefined && { order }),
    };

    const updated = await Experience.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update experience",
      error: error.message,
    });
  }
});

// DELETE: Delete experience (Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const deleted = await Experience.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete experience",
      error: error.message,
    });
  }
});

// PATCH: Reorder experiences (Admin)
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
      await Experience.bulkWrite(bulkOps);
    }

    const reordered = await Experience.find().sort({ order: 1 });

    return res.status(200).json({
      success: true,
      message: "Experiences reordered successfully",
      data: reordered,
    });
  } catch (error) {
    console.error("Error reordering experiences:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reorder experiences",
      error: error.message,
    });
  }
});

export default router;
