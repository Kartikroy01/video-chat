import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import UploadStudentId from "./pages/UploadStudentId";
import AdminDashboard from "./pages/AdminDashboard";
import Friends from "./pages/Friends";
import PrivateChat from "./pages/PrivateChat";
import Navbar from "./components/Navbar";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {/* Conditionally render Navbar if not on admin route */}
      {!window.location.pathname.startsWith("/admin") && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload-student-id"
          element={
            user && !user.isApproved ? (
              <UploadStudentId />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/chat"
          element={
            user && user.isApproved ? <Chat /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/private-chat/:friendId"
          element={
            user && user.isApproved ? (
              <PrivateChat />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/friends"
          element={
            user && user.isApproved ? <Friends /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
