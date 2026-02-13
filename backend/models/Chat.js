import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        anonymousName: String,
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        senderAnonymousName: String,
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    chatType: {
      type: String,
      enum: ["random", "private"],
      default: "random",
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: Date,
    duration: Number, // in seconds
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Chat", chatSchema);
