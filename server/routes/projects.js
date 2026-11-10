import express from "express";
import { connectDB } from "../lib/db.js";
import Project from "../models/Project.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const INITIAL_PROJECTS = [
  {
    title: "Panchakarma Management System",
    description:
      "A backend management system for managing patients, therapies, treatment plans, sessions, and billing with structured REST APIs and API documentation.",
    tech: ["Node.js", "Express.js", "MongoDB", "Mongoose", "Swagger"],
    github: "https://github.com/aadiityaasingh/PanchVeda_backend_system",
    live: "panchakarma-backend-system.onrender.com/api-docs",
    icon: "Activity",
    color: "from-emerald-400 to-teal-600",
    bgAccent: "bg-emerald-500/10",
    order: 0,
    featured: true,
  },
  {
    title: "HireHorizon",
    description:
      "A job portal that allows companies to create profiles and publish job opportunities while providing users with a platform to explore and manage job listings.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Vite"],
    github: "https://github.com/aadiityaasingh/hirehorizon_frontend_system",
    live: "hirehorizonfrontendsystem.vercel.app",
    icon: "BriefcaseBusiness",
    color: "from-blue-400 to-cyan-600",
    bgAccent: "bg-blue-500/10",
    order: 1,
    featured: true,
  },
  {
    title: "StaySphere",
    description:
      "A full-stack accommodation platform inspired by Airbnb, featuring property listings, user interactions, authentication, and dynamic web interfaces.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/aadiityaasingh/staySphere",
    live: "staySphere-virid.vercel.app",
    icon: "House",
    color: "from-orange-400 to-red-600",
    bgAccent: "bg-orange-500/10",
    order: 2,
    featured: true,
  },
];

// GET: Fetch all projects (Public)
router.get("/", async (req, res) => {
  try {
    await connectDB();

    let count = await Project.countDocuments();
    if (count === 0) {
      console.log("Seeding initial projects into MongoDB...");
      await Project.insertMany(INITIAL_PROJECTS);
    }

    // Sort by order ascending, then newest first
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    // If DB is not connected yet, gracefully return the fallback initial projects
    return res.status(200).json({
      success: false,
      message: "Database connection failed, using fallback projects",
      error: error.message,
      data: INITIAL_PROJECTS,
    });
  }
});

// POST: Create a new project (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const {
      title,
      description,
      tech,
      github,
      live,
      image,
      icon,
      color,
      bgAccent,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    // Determine order (append to the end by default)
    const lastProject = await Project.findOne().sort({ order: -1 });
    const order = lastProject && typeof lastProject.order === "number" ? lastProject.order + 1 : 0;

    const formattedTech = Array.isArray(tech)
      ? tech
      : typeof tech === "string"
      ? tech.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const newProject = new Project({
      title,
      description,
      tech: formattedTech,
      github: github || "",
      live: live || "",
      image: image || "",
      icon: icon || "Activity",
      color: color || "from-blue-400 to-cyan-600",
      bgAccent: bgAccent || "bg-blue-500/10",
      featured: Boolean(featured),
      order,
    });

    const saved = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project added successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
});

// PUT: Update an existing project (Admin Only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const {
      title,
      description,
      tech,
      github,
      live,
      image,
      icon,
      color,
      bgAccent,
      featured,
      order,
    } = req.body;

    const formattedTech = Array.isArray(tech)
      ? tech
      : typeof tech === "string"
      ? tech.split(",").map((t) => t.trim()).filter(Boolean)
      : undefined;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(formattedTech && { tech: formattedTech }),
      ...(github !== undefined && { github }),
      ...(live !== undefined && { live }),
      ...(image !== undefined && { image }),
      ...(icon && { icon }),
      ...(color && { color }),
      ...(bgAccent && { bgAccent }),
      ...(featured !== undefined && { featured }),
      ...(order !== undefined && { order }),
    };

    const updated = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
});

// DELETE: Delete a project (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
});

// PATCH: Reorder projects (Admin Only)
router.patch("/reorder", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { orderedIds } = req.body; // Array of IDs in the new sequence: [id0, id1, id2...]

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        message: "orderedIds must be an array of project IDs.",
      });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps);
    }

    const reordered = await Project.find().sort({ order: 1 });

    return res.status(200).json({
      success: true,
      message: "Projects reordered successfully",
      data: reordered,
    });
  } catch (error) {
    console.error("Error reordering projects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reorder projects",
      error: error.message,
    });
  }
});

export default router;
