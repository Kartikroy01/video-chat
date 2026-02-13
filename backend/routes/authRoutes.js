import express from "express";
import {
  register,
  verifyEmail,
  login,
  uploadStudentId,
  getCurrentUser,
  logout,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post(
  "/upload-student-id",
  protect,
  upload.single("studentId"),
  uploadStudentId,
);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);

export default router;
