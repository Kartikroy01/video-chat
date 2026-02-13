import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      private: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    institutionName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "5th"],
      required: true,
    },
    studentIdImage: {
      filename: String,
      url: String,
      uploadedAt: Date,
    },
    anonymousName: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequestsSent: [
      {
        recipientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    friendRequestsReceived: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        receivedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    otp: {
      type: String,
      select: false,
    },
    otpExpire: {
      type: Date,
      select: false,
    },
    passwordResetOtp: {
      type: String,
      select: false,
    },
    passwordResetOtpExpire: {
      type: Date,
      select: false,
    },
    lastOnline: Date,
    isOnline: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate anonymous name if not exists
userSchema.pre("save", async function (next) {
  if (!this.anonymousName) {
    const adjectives = [
      "Silent",
      "Swift",
      "Bright",
      "Calm",
      "Clever",
      "Happy",
      "Jolly",
      "Kind",
      "Lazy",
      "Mighty",
      "Noble",
      "Quick",
      "Rare",
      "Smart",
      "Tough",
      "Wise",
    ];
    const animals = [
      "Tiger",
      "Eagle",
      "Phoenix",
      "Wolf",
      "Bear",
      "Lion",
      "Panda",
      "Owl",
      "Fox",
      "Swan",
      "Raven",
      "Hawk",
      "Elk",
      "Whale",
      "Shark",
      "Dragon",
    ];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const randomNum = Math.floor(Math.random() * 100);

    this.anonymousName = `${randomAdj}${randomAnimal}${randomNum}`;
  }
  next();
});

export default mongoose.model("User", userSchema);
