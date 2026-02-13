import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../config";

const Chat = () => {
  const { socket, onlineCount } = useSocket();
  const { user } = useAuth();
  const [chatState, setChatState] = useState("waiting"); // waiting, matched, ended
  const [otherUser, setOtherUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // WebRTC Refs and State
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // WebRTC Configuration
  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:global.stun.twilio.com:3478" },
    ],
  };

  useEffect(() => {
    // requesting camera permission on mount
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError(
          "Could not access camera/microphone. Please allow permissions.",
        );
      }
    };

    startLocalStream();

    return () => {
      // Cleanup local stream on unmount
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure local video ref is updated if stream changes or ref becomes available
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Handle WebRTC Peer Connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote tracks
    pc.ontrack = (event) => {
      console.log("Received remote track");
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && chatId) {
        socket.emit("webrtc_ice_candidate", {
          chatId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.current = pc;
    return pc;
  };

  // Socket Event Listeners including WebRTC
  useEffect(() => {
    if (!socket) return;

    socket.on("match_found", async (data) => {
      setChatId(data.chatId);
      setOtherUser(data.otherUser);
      setChatState("matched");
      setMessages([]);
      setError("");

      // Initiate WebRTC if we are the initiator (User 1)
      if (data.isInitiator) {
        console.log("I am the initiator, creating offer...");
        const pc = createPeerConnection();
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc_offer", {
            chatId: data.chatId,
            offer,
          });
        } catch (err) {
          console.error("Error creating offer:", err);
        }
      } else {
        console.log("I am waiting for offer...");
      }
    });

    socket.on("receive_webrtc_offer", async (data) => {
      console.log("Received offer");
      const pc = createPeerConnection();
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc_answer", {
          chatId: chatId || data.chatId, // data.chatId might be safer if state update is slow
          answer,
        });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socket.on("receive_webrtc_answer", async (data) => {
      console.log("Received answer");
      if (peerConnection.current) {
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
        } catch (err) {
          console.error("Error setting remote description:", err);
        }
      }
    });

    socket.on("receive_webrtc_ice_candidate", async (data) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          message: data.message,
          timestamp: new Date(data.timestamp),
        },
      ]);
    });

    socket.on("user_typing", (data) => {
      if (data.user !== user.anonymousName) {
        setIsTyping(true);
      }
    });

    socket.on("user_stop_typing", (data) => {
      if (data.user !== user.anonymousName) {
        setIsTyping(false);
      }
    });

    socket.on("chat_ended", (data) => {
      setChatState("ended");
      setError(data.message);

      // Close WebRTC
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      setRemoteStream(null);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

      setTimeout(() => {
        resetChat();
      }, 3000);
    });

    return () => {
      socket.off("match_found");
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("chat_ended");
      socket.off("receive_webrtc_offer");
      socket.off("receive_webrtc_answer");
      socket.off("receive_webrtc_ice_candidate");
    };
  }, [socket, user, chatId, localStream]); // Added chatId and localStream dependencies

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = () => {
    if (!socket) return;
    setChatState("waiting");
    socket.emit("join_queue");
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    socket.emit("send_message", {
      chatId,
      message: inputMessage,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: user.anonymousName,
        message: inputMessage,
        timestamp: new Date(),
      },
    ]);

    setInputMessage("");
    socket.emit("stop_typing", { chatId });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Emit typing indicator
    socket.emit("typing", { chatId });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { chatId });
    }, 3000);
  };

  const nextChat = () => {
    socket.emit("next_chat", { chatId });

    // Close WebRTC
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setRemoteStream(null);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setChatState("waiting");
    setOtherUser(null);
    setMessages([]);
  };

  const endChat = () => {
    socket.emit("end_chat", { chatId });

    // Close WebRTC
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setRemoteStream(null);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    resetChat();
  };

  const reportUser = async () => {
    if (!otherUser) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/chat/report`,
        {
          reportedUserId: otherUser.userId,
          reason: "Inappropriate Content",
          description: "User behavior in random chat",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      alert(response.data.message);
    } catch (err) {
      alert("Error reporting user");
    }
  };

  const resetChat = () => {
    setChatState("waiting");
    setOtherUser(null);
    setChatId(null);
    setMessages([]);
    setError("");
    startChat();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  if (chatState === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-white/20">
          {/* Show local video to waiting user so they know they are ready */}
          <div className="relative w-full h-48 bg-black rounded-xl mb-8 overflow-hidden shadow-xl ring-2 ring-blue-500/30">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>{" "}
              Ready
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin"></div>
              <div
                className="absolute inset-2 border-4 border-transparent border-b-indigo-400 border-l-indigo-400 rounded-full animate-spin"
                style={{ animationDirection: "reverse" }}
              ></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Finding Your Match...
          </h2>
          <p className="text-gray-300 mb-6 text-sm">
            Searching for verified students to connect with
          </p>
          <div className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
            <span className="text-sm text-blue-200 font-semibold">
              👥 {onlineCount} students online
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col md:flex-row h-screen overflow-hidden">
      {/* LEFT: Video Section (50% on Desktop) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col relative bg-black">
        {/* Main Video Area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {chatState === "matched" ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-white text-center">
              <div className="text-6xl mb-4 opacity-40">📹</div>
              <p className="text-lg text-gray-400">Waiting for video...</p>
            </div>
          )}

          {/* Local Video (PiP) */}
          <div className="absolute top-4 right-4 w-36 h-48 bg-gray-800 border-2 border-white/20 rounded-xl overflow-hidden shadow-2xl z-20 hover:shadow-3xl transition-shadow">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-semibold">
              You
            </div>
          </div>

          {/* User Info Badge */}
          {chatState === "matched" && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 z-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {otherUser?.anonymousName?.charAt(0) || "?"}
                </div>
                <div className="text-white">
                  <p className="font-bold text-sm">
                    {otherUser?.anonymousName || "Stranger"}
                  </p>
                  <p className="text-xs text-gray-300">
                    {otherUser?.institution || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="bg-gradient-to-t from-gray-950 to-gray-900/95 backdrop-blur-md border-t border-gray-700/50 px-6 py-4 space-y-3 z-30">
          {/* Main Controls Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg ${
                  isMuted
                    ? "bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400/50"
                    : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-xl"
                }`}
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMuted ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.7 3.3a1 1 0 0 1 1.4 0l12 12a1 1 0 1 1-1.4 1.4l-12-12a1 1 0 0 1 0-1.4Z" />
                    <path d="M20 8a8 8 0 0 0-11.3-7.3M4 20a8.001 8.001 0 0 0 13-7.3" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Z" />
                    <path d="M17 16.91c-1.49 1.46-3.5 2.09-5 2.09-1.5 0-3.51-.63-5-2.09M19 21h-2v-2h2v2Z" />
                  </svg>
                )}
              </button>

              {/* Camera Button */}
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg ${
                  isVideoOff
                    ? "bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400/50"
                    : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-xl"
                }`}
                title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
              >
                {isVideoOff ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.7 3.3a1 1 0 0 1 1.4 0l12 12a1 1 0 1 1-1.4 1.4l-12-12a1 1 0 0 1 0-1.4Z" />
                    <path d="M20 11h3v4h-3v-4Z" />
                    <path d="M20 7c0-1.66-1.34-3-3-3H5c-1.66 0-3 1.34-3 3v10c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3v-1l3 3v-4l-3 3v-8Z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 11h3v4h-3v-4Z" />
                    <path d="M20 7c0-1.66-1.34-3-3-3H5c-1.66 0-3 1.34-3 3v10c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3v-1l3 3v-4l-3 3v-8Z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Next Chat Button */}
              <button
                onClick={nextChat}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
                title="Skip to next chat"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4v16h2V4H4Zm14.5 1.5L8.5 12l10 6.5V5.5Z" />
                </svg>
                Next
              </button>

              {/* End Chat Button */}
              <button
                onClick={endChat}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:shadow-xl active:scale-95"
                title="End current chat"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4Z" />
                </svg>
                End
              </button>
            </div>
          </div>

          {/* Secondary Controls Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-700/30">
            {/* Report User Button */}
            <button
              onClick={reportUser}
              className="p-2.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 flex items-center gap-1"
              title="Report inappropriate behavior"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z" />
              </svg>
              <span className="text-xs hidden sm:inline">Report</span>
            </button>

            {/* Add Friend Button */}
            <button
              className="p-2.5 text-gray-400 hover:text-green-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 flex items-center gap-1"
              title="Add to friends"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm-9-2c1.66 0 3-1.34 3-3S7.66 4 6 4 3 5.34 3 7s1.34 3 3 3Zm0 4C3.67 18 2 19.37 2 21v2h8v-2c0-1.63-1.67-3-3-3Zm9-.5c-1.58 0-2.5 1-2.5 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-3s-.92-1-2.5-1Z" />
              </svg>
              <span className="text-xs hidden sm:inline">Add Friend</span>
            </button>

            {/* Block User Button */}
            <button
              className="p-2.5 text-gray-400 hover:text-orange-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 flex items-center gap-1"
              title="Block this user"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5Zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11Zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5Z" />
              </svg>
              <span className="text-xs hidden sm:inline">Block</span>
            </button>

            <div className="flex-1"></div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span
                className={`w-2 h-2 rounded-full ${chatState === "matched" ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
              ></span>
              {chatState === "matched" ? "Connected" : "Waiting..."}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat Section (50% on Desktop) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-white shadow-2xl">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 shadow-lg z-10 flex items-center justify-between min-h-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 font-bold text-lg shadow-lg">
              {otherUser?.anonymousName?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {otherUser?.anonymousName || "Stranger"}
              </h3>
              <p className="text-xs text-blue-100 flex items-center gap-1.5">
                <span>🏫</span> {otherUser?.institution || "Unknown"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTyping && (
              <span className="text-xs italic text-blue-100 font-medium animate-pulse flex items-center gap-1">
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </span>
                typing
              </span>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white space-y-4 scroll-smooth">
          {messages.length === 0 && chatState === "matched" && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4 opacity-50">👋</div>
              <p className="text-gray-500 font-medium">You're connected!</p>
              <p className="text-gray-400 text-sm">Start a conversation</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.sender === user.anonymousName ? "justify-end" : "justify-start"} animate-[slideIn_0.3s_ease-out]`}
            >
              <div
                className={`max-w-xs rounded-2xl px-5 py-3 shadow-md ${
                  msg.sender === user.anonymousName
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none shadow-blue-200"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-gray-100"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">
                  {msg.message}
                </p>
                <span
                  className={`text-xs opacity-70 mt-2 block text-right font-medium ${msg.sender === user.anonymousName ? "text-blue-100" : "text-gray-400"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {error && (
            <div className="bg-red-50 text-red-800 border-l-4 border-red-500 p-4 rounded-r shadow-sm text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg backdrop-blur-sm bg-white/95">
          <form
            onSubmit={sendMessage}
            className="relative flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder={
                chatState === "ended" ? "Chat ended" : "Type a message..."
              }
              disabled={chatState === "ended"}
              className="flex-1 px-5 py-3 bg-gray-100 border border-gray-300 rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={chatState === "ended" || !inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-110 active:scale-95 hover:shadow-xl flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
