import express from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "aditya@portfolio.dev";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const jwtSecret = process.env.JWT_SECRET || "default_portfolio_secret_key_change_in_production";

    // Validate credentials
    const isEmailMatch = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
    const isPassMatch = password === adminPassword;

    if (!isEmailMatch || !isPassMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Sign JWT (expires in 7 days)
    const token = jwt.sign(
      { email: adminEmail, role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      token,
      admin: {
        email: adminEmail,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login.",
      error: error.message,
    });
  }
});

// Verify token
router.get("/verify", authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Token is valid",
    admin: req.admin,
  });
});

export default router;
