import User from "../models/User.js";
import Report from "../models/Report.js";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../utils/emailService.js";

// @route   GET /api/admin/pending-approvals
// @desc    Get pending user verifications
// @access  Private/Admin
export const getPendingApprovals = async (req, res, next) => {
  try {
    const users = await User.find({
      isVerified: true,
      isApproved: false,
    }).select("-password -emailVerificationToken");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/admin/approve-user
// @desc    Approve a user
// @access  Private/Admin
export const approveUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isApproved = true;
    await user.save();

    // Send approval email
    await sendApprovalEmail(user.email, user.name);

    res.json({
      success: true,
      message: "User approved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/admin/reject-user
// @desc    Reject a user
// @access  Private/Admin
export const rejectUser = async (req, res, next) => {
  try {
    const { userId, reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send rejection email
    await sendRejectionEmail(user.email, reason);

    // You can either delete the user or mark as rejected
    await User.deleteOne({ _id: userId });

    res.json({
      success: true,
      message: "User rejected successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/admin/ban-user
// @desc    Ban a user
// @access  Private/Admin
export const banUser = async (req, res, next) => {
  try {
    const { userId, reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBanned = true;
    await user.save();

    res.json({
      success: true,
      message: "User banned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/admin/unban-user
// @desc    Unban a user
// @access  Private/Admin
export const unbanUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBanned = false;
    await user.save();

    res.json({
      success: true,
      message: "User unbanned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/reports
// @desc    Get all reports
// @access  Private/Admin
export const getReports = async (req, res, next) => {
  try {
    const { status = "pending" } = req.query;

    const query = status ? { status } : {};
    const reports = await Report.find(query)
      .populate("reporter", "email anonymousName")
      .populate("reportedUser", "email anonymousName");

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/admin/resolve-report
// @desc    Resolve a report
// @access  Private/Admin
export const resolveReport = async (req, res, next) => {
  try {
    const { reportId, status, adminNotes } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;
    report.adminNotes = adminNotes;
    await report.save();

    // If status is 'action-taken', ban the user
    if (status === "action-taken") {
      await User.findByIdAndUpdate(report.reportedUser, { isBanned: true });
    }

    res.json({
      success: true,
      message: "Report resolved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/dashboard
// @desc    Get dashboard analytics
// @access  Private/Admin
export const getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ isApproved: true });
    const pendingApprovals = await User.countDocuments({
      isVerified: true,
      isApproved: false,
    });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const onlineUsers = await User.countDocuments({ isOnline: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        approvedUsers,
        pendingApprovals,
        bannedUsers,
        totalReports,
        pendingReports,
        onlineUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/all-users
// @desc    Get all users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -emailVerificationToken");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
