import Chat from "../models/Chat.js";
import User from "../models/User.js";

// @route   POST /api/chat/report
// @desc    Report a user
// @access  Private
export const reportUser = async (req, res, next) => {
  try {
    const { reportedUserId, reason, description } = req.body;

    if (!reportedUserId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const { Report } = await import("../models/Report.js");

    const report = new Report({
      reporter: req.user._id,
      reportedUser: reportedUserId,
      reason,
      description,
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "User reported successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/chat/block-user
// @desc    Block a user
// @access  Private
export const blockUser = async (req, res, next) => {
  try {
    const { blockedUserId } = req.body;

    const user = await User.findById(req.user._id);

    if (user.blockedUsers.includes(blockedUserId)) {
      return res.status(400).json({
        success: false,
        message: "User already blocked",
      });
    }

    user.blockedUsers.push(blockedUserId);
    await user.save();

    res.json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/chat/unblock-user
// @desc    Unblock a user
// @access  Private
export const unblockUser = async (req, res, next) => {
  try {
    const { blockedUserId } = req.body;

    const user = await User.findById(req.user._id);

    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== blockedUserId,
    );
    await user.save();

    res.json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/chat/blocked-users
// @desc    Get list of blocked users
// @access  Private
export const getBlockedUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "blockedUsers",
      "name",
    );

    res.json({
      success: true,
      blockedUsers: user.blockedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/chat/friends
// @desc    Get friend list
// @access  Private
export const getFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "anonymousName institutionName",
    );

    res.json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/chat/send-friend-request
// @desc    Send friend request
// @access  Private
export const sendFriendRequest = async (req, res, next) => {
  try {
    const { recipientId } = req.body;

    const recipient = await User.findOne({
      _id: recipientId,
      "friendRequestsReceived.senderId": { $ne: req.user._id },
    });

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: "User not found or request already sent",
      });
    }

    const sender = await User.findById(req.user._id);
    sender.friendRequestsSent.push({
      recipientId,
    });
    await sender.save();

    recipient.friendRequestsReceived.push({
      senderId: req.user._id,
    });
    await recipient.save();

    res.json({
      success: true,
      message: "Friend request sent",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/chat/accept-friend-request
// @desc    Accept friend request
// @access  Private
export const acceptFriendRequest = async (req, res, next) => {
  try {
    const { senderId } = req.body;

    const user = await User.findById(req.user._id);
    const sender = await User.findById(senderId);

    // Check if request exists
    const requestExists = user.friendRequestsReceived.some(
      (req) => req.senderId.toString() === senderId,
    );

    if (!requestExists) {
      return res.status(400).json({
        success: false,
        message: "Friend request not found",
      });
    }

    // Add to friends list
    user.friends.push(senderId);
    sender.friends.push(req.user._id);

    // Remove requests
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (req) => req.senderId.toString() !== senderId,
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (req) => req.recipientId.toString() !== req.user._id,
    );

    await user.save();
    await sender.save();

    res.json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/chat/reject-friend-request
// @desc    Reject friend request
// @access  Private
export const rejectFriendRequest = async (req, res, next) => {
  try {
    const { senderId } = req.body;

    const user = await User.findById(req.user._id);
    const sender = await User.findById(senderId);

    // Remove requests
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (req) => req.senderId.toString() !== senderId,
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (req) => req.recipientId.toString() !== req.user._id,
    );

    await user.save();
    await sender.save();

    res.json({
      success: true,
      message: "Friend request rejected",
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/chat/pending-requests
// @desc    Get pending friend requests
// @access  Private
export const getPendingRequests = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friendRequestsReceived.senderId",
      "anonymousName institutionName",
    );

    res.json({
      success: true,
      pendingRequests: user.friendRequestsReceived,
    });
  } catch (error) {
    next(error);
  }
};
