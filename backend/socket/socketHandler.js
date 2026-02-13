import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import matchingQueue from "../utils/matchingQueue.js";
import { filterBadWords } from "../utils/badWordFilter.js";

export const initializeSocket = (io) => {
  // Middleware to verify JWT token
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication failed"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isApproved || user.isBanned) {
        return next(new Error("User not authorized"));
      }

      socket.userId = user._id;
      socket.anonymousName = user.anonymousName;
      socket.institutionName = user.institutionName;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // User goes online
    socket.on("user_online", async () => {
      const user = await User.findById(socket.userId);
      user.isOnline = true;
      user.lastOnline = new Date();
      await user.save();

      io.emit("update_online_count", {
        onlineCount: matchingQueue.getOnlineUsersCount(),
      });
    });

    // Join matching queue for random chat
    socket.on("join_queue", () => {
      matchingQueue.addUser(
        socket.userId,
        socket.id,
        socket.anonymousName,
        socket.institutionName,
      );

      const match = matchingQueue.findMatch();

      if (match) {
        // Emit to both users that they are matched
        // User 1 is the initiator for WebRTC
        io.to(match.user1.socketId).emit("match_found", {
          chatId: match.chatId,
          otherUser: {
            anonymousName: match.user2.anonymousName,
            institution: match.user2.institution,
          },
          isInitiator: true,
        });

        io.to(match.user2.socketId).emit("match_found", {
          chatId: match.chatId,
          otherUser: {
            anonymousName: match.user1.anonymousName,
            institution: match.user1.institution,
          },
          isInitiator: false,
        });

        // Create chat room
        const room = `chat_${match.chatId}`;
        io.sockets.get(match.user1.socketId)?.join(room);
        io.sockets.get(match.user2.socketId)?.join(room);
      }

      io.emit("update_online_count", {
        onlineCount: matchingQueue.getOnlineUsersCount(),
      });
    });

    // Send message in chat
    socket.on("send_message", async (data) => {
      const { chatId, message } = data;

      if (!message.trim()) return;

      const filteredMessage = filterBadWords(message);
      const room = `chat_${chatId}`;

      socket.to(room).emit("receive_message", {
        sender: socket.anonymousName,
        message: filteredMessage,
        timestamp: new Date(),
      });
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { chatId } = data;
      const room = `chat_${chatId}`;

      socket.to(room).emit("user_typing", {
        user: socket.anonymousName,
      });
    });

    // Stop typing
    socket.on("stop_typing", (data) => {
      const { chatId } = data;
      const room = `chat_${chatId}`;

      socket.to(room).emit("user_stop_typing", {
        user: socket.anonymousName,
      });
    });

    // Next button - leave current chat and rejoin queue
    socket.on("next_chat", (data) => {
      const { chatId } = data;
      const room = `chat_${chatId}`;

      socket.leave(room);
      matchingQueue.endChat(chatId);

      // Rejoin queue
      matchingQueue.addUser(
        socket.userId,
        socket.id,
        socket.anonymousName,
        socket.institutionName,
      );

      const match = matchingQueue.findMatch();

      if (match) {
        // User 1 is initiator
        io.to(match.user1.socketId).emit("match_found", {
          chatId: match.chatId,
          otherUser: {
            anonymousName: match.user2.anonymousName,
            institution: match.user2.institution,
          },
          isInitiator: true, 
        });

        io.to(match.user2.socketId).emit("match_found", {
          chatId: match.chatId,
          otherUser: {
            anonymousName: match.user1.anonymousName,
            institution: match.user1.institution,
          },
          isInitiator: false,
        });

        const newRoom = `chat_${match.chatId}`;
        io.sockets.get(match.user1.socketId)?.join(newRoom);
        io.sockets.get(match.user2.socketId)?.join(newRoom);
      }

      io.emit("update_online_count", {
        onlineCount: matchingQueue.getOnlineUsersCount(),
      });
    });

    // End chat
    socket.on("end_chat", (data) => {
      const { chatId } = data;
      const room = `chat_${chatId}`;

      socket.to(room).emit("chat_ended", {
        message: "The other user ended the chat",
      });

      socket.leave(room);
      matchingQueue.endChat(chatId);
      matchingQueue.removeUser(socket.userId);

      io.emit("update_online_count", {
        onlineCount: matchingQueue.getOnlineUsersCount(),
      });
    });

    // Private message to friend
    socket.on("private_message", async (data) => {
      const { recipientId, message } = data;

      const filteredMessage = filterBadWords(message);

      io.to(`private_${recipientId}`).emit("receive_private_message", {
        sender: socket.anonymousName,
        senderId: socket.userId,
        message: filteredMessage,
        timestamp: new Date(),
      });
    });

    // Disconnect
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.userId}`);

      const user = await User.findById(socket.userId);
      if (user) {
          user.isOnline = false;
          user.lastOnline = new Date();
          await user.save();
      }

      matchingQueue.removeUser(socket.userId);
      matchingQueue.getOnlineUsersCount();

      io.emit("update_online_count", {
        onlineCount: matchingQueue.getOnlineUsersCount(),
      });
    });

    // WebRTC signaling
    socket.on("webrtc_offer", (data) => {
      const { recipientId, offer, chatId } = data;
      const room = chatId ? `chat_${chatId}` : `private_${recipientId}`;

      // USE socket.to() instead of io.to() to prevent echo
      socket.to(room).emit("receive_webrtc_offer", {
        from: socket.userId,
        offer,
      });
    });

    socket.on("webrtc_answer", (data) => {
      const { recipientId, answer, chatId } = data;
      const room = chatId ? `chat_${chatId}` : `private_${recipientId}`;

      socket.to(room).emit("receive_webrtc_answer", {
        from: socket.userId,
        answer,
      });
    });

    socket.on("webrtc_ice_candidate", (data) => {
      const { recipientId, candidate, chatId } = data;
      const room = chatId ? `chat_${chatId}` : `private_${recipientId}`;

      socket.to(room).emit("receive_webrtc_ice_candidate", {
        from: socket.userId,
        candidate,
      });
    });
  });
};
