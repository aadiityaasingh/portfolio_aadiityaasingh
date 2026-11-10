import express from "express";
import { connectDB } from "../lib/db.js";
import Certification from "../models/Certification.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const INITIAL_CERTIFICATIONS = [
  {
    title: "Introduction to Web Development with ChatGPT",
    issuer: "",
    date: "",
    credentialUrl: "",
    order: 0,
  },
  {
    title: "IBM SkillBuild: Full Stack Development (MERN Specialization)",
    issuer: "IBM",
    date: "",
    credentialUrl: "",
    order: 1,
  },
  {
    title: "GitHub Copilot Fundamentals",
    issuer: "GitHub",
    date: "",
    credentialUrl: "",
    order: 2,
  },
  {
    title: "Postman - Postman API Fundamentals Student Expert",
    issuer: "Postman",
    date: "",
    credentialUrl: "",
    order: 3,
  },
];

// GET: Fetch all certifications (Public)
router.get("/", async (req, res) => {
  try {
    await connectDB();

    const count = await Certification.countDocuments();
    if (count === 0) {
      console.log("Seeding initial certifications into MongoDB...");
      await Certification.insertMany(INITIAL_CERTIFICATIONS);
    }

    const list = await Certification.find().sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return res.status(200).json({
      success: false,
      message: "Database connection failed, using fallback certifications",
      error: error.message,
      data: INITIAL_CERTIFICATIONS,
    });
  }
});

// POST: Add new certification (Admin)
router.post("/", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { title, issuer, date, credentialUrl } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Certification title is required.",
      });
    }

    const lastCert = await Certification.findOne().sort({ order: -1 });
    const order = lastCert && typeof lastCert.order === "number" ? lastCert.order + 1 : 0;

    const newCert = new Certification({
      title: title.trim(),
      issuer: issuer ? issuer.trim() : "",
      date: date ? date.trim() : "",
      credentialUrl: credentialUrl ? credentialUrl.trim() : "",
      order,
    });

    const saved = await newCert.save();

    return res.status(201).json({
      success: true,
      message: "Certification added successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating certification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create certification",
      error: error.message,
    });
  }
});

// PUT: Update certification (Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { title, issuer, date, credentialUrl, order } = req.body;

    const updateData = {
      ...(title && { title: title.trim() }),
      ...(issuer !== undefined && { issuer: issuer.trim() }),
      ...(date !== undefined && { date: date.trim() }),
      ...(credentialUrl !== undefined && { credentialUrl: credentialUrl.trim() }),
      ...(order !== undefined && { order }),
    };

    const updated = await Certification.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certification updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating certification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update certification",
      error: error.message,
    });
  }
});

// DELETE: Delete certification (Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const deleted = await Certification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete certification",
      error: error.message,
    });
  }
});

// PATCH: Reorder certifications (Admin)
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
      await Certification.bulkWrite(bulkOps);
    }

    const reordered = await Certification.find().sort({ order: 1 });

    return res.status(200).json({
      success: true,
      message: "Certifications reordered successfully",
      data: reordered,
    });
  } catch (error) {
    console.error("Error reordering certifications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reorder certifications",
      error: error.message,
    });
  }
});

export default router;
