import express from "express";
import {
  reportUser,
  blockUser,
  unblockUser,
  getBlockedUsers,
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
} from "../controllers/chatController.js";
import { protect, requireApproved } from "../middleware/auth.js";

const router = express.Router();

// All chat routes require authentication and approval
router.use(protect, requireApproved);

router.post("/report", reportUser);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);
router.get("/blocked-users", getBlockedUsers);
router.get("/friends", getFriends);
router.post("/send-friend-request", sendFriendRequest);
router.post("/accept-friend-request", acceptFriendRequest);
router.post("/reject-friend-request", rejectFriendRequest);
router.get("/pending-requests", getPendingRequests);

export default router;
