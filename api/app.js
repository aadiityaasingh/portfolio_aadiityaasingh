import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import skillRoutes from "./routes/skills.js";
import experienceRoutes from "./routes/experience.js";
import certificationRoutes from "./routes/certifications.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check (handles both /api/health and /health)
app.get(["/api/health", "/health"], (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount Routes (handles both /api/* and /* for Vercel Serverless compatibility)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/projects", projectRoutes);
app.use("/projects", projectRoutes);

app.use("/api/skills", skillRoutes);
app.use("/skills", skillRoutes);

app.use("/api/experience", experienceRoutes);
app.use("/experience", experienceRoutes);

app.use("/api/certifications", certificationRoutes);
app.use("/certifications", certificationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred",
    error: err.message,
  });
});

export default app;
