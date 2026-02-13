import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

const SocketContext = createContext();

const SOCKET_URL = API_URL;

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (token) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
        newSocket.emit("user_online");
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      newSocket.on("update_online_count", (data) => {
        setOnlineCount(data.onlineCount);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  const value = {
    socket,
    onlineCount,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
