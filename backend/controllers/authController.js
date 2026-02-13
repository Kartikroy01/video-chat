import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/emailService.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, institutionName, course, year } = req.body;

    // Validate student email domain
    const emailDomains = ["edu", "ac.in"];
    const emailDomain = email.split("@")[1];
    const isValidDomain = emailDomains.some((domain) =>
      emailDomain.endsWith(domain),
    );

    if (!isValidDomain) {
      return res.status(400).json({
        success: false,
        message:
          "Please use a valid student email (.edu, .ac.in, or university domain)",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    user = new User({
      name,
      email,
      password,
      institutionName,
      course,
      year,
      otp,
      otpExpire,
    });

    await user.save();

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for the OTP.",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully. Please wait for admin approval.",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Check if account is approved
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin approval",
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = generateToken(user._id);

    // Update last online
    user.lastOnline = new Date();
    user.isOnline = true;
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        anonymousName: user.anonymousName,
        institutionName: user.institutionName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/upload-student-id
// @desc    Upload student ID verification
// @access  Private
export const uploadStudentId = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const user = await User.findById(req.user._id);

    user.studentIdImage = {
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    await user.save();

    res.json({
      success: true,
      message: "Student ID uploaded successfully",
      imageUrl: user.studentIdImage.url,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        anonymousName: user.anonymousName,
        institutionName: user.institutionName,
        isApproved: user.isApproved,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.isOnline = false;
    user.lastOnline = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/forgot-password
// @desc    Send OTP for password reset to user email
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate 6-digit OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.passwordResetOtp = resetOtp;
    user.passwordResetOtpExpire = resetOtpExpire;

    await user.save();

    // Send OTP via email
    try {
      await sendOtpEmail(email, resetOtp, "Password Reset OTP - Zocialin");
      res.json({
        success: true,
        message:
          "Password reset OTP sent to your email. Check spam folder if not found.",
      });
    } catch (emailError) {
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpire = undefined;

      return res.status(500).json({
        success: false,
        message: "Error sending email. Please try again later.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify OTP for password reset
// @access  Public
export const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    const user = await User.findOne({
      email,
      passwordResetOtp: otp,
      passwordResetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/reset-password
// @desc    Reset user password with valid OTP
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, OTP, password and confirm password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      email,
      passwordResetOtp: otp,
      passwordResetOtpExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update password
    user.password = password;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
