import express from "express";
import {
  getPendingApprovals,
  approveUser,
  rejectUser,
  banUser,
  unbanUser,
  getReports,
  resolveReport,
  getDashboard,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/pending-approvals", getPendingApprovals);
router.post("/approve-user", approveUser);
router.post("/reject-user", rejectUser);
router.post("/ban-user", banUser);
router.post("/unban-user", unbanUser);
router.get("/reports", getReports);
router.post("/resolve-report", resolveReport);
router.get("/all-users", getAllUsers);

export default router;
