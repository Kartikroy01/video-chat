import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-blue-900/95 backdrop-blur-xl shadow-lg shadow-blue-500/10 border-b border-slate-700/50"
          : "bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-blue-900/80 backdrop-blur-md border-b border-slate-700/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-2.5 py-1.5 rounded-lg block group-hover:scale-110 transition-transform duration-200">
                🎓
              </span>
            </div>
            <span className="text-xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 group-hover:from-blue-300 group-hover:to-cyan-300 transition-all duration-300">
              Zocialin
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-blue-300 font-medium transition-all duration-200 relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-cyan-500 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-6">
                  {/* User Greeting */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Welcome
                    </span>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent px-3 py-1.5 rounded-full border border-blue-500/30 bg-slate-700/30">
                      {user.name?.split(" ")[0]}
                    </span>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex items-center gap-6 pl-6 border-l border-slate-700/50">
                    <Link
                      to="/dashboard"
                      className="text-slate-300 hover:text-blue-300 font-medium transition-all duration-200 relative group"
                    >
                      Dashboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="text-slate-300 hover:text-blue-300 font-medium transition-all duration-200 relative group"
                      >
                        Admin
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    )}

                    {user.isApproved && (
                      <>
                        <Link
                          to="/chat"
                          className="text-slate-300 hover:text-blue-300 font-medium transition-all duration-200 relative group"
                        >
                          Chat
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                          to="/friends"
                          className="text-slate-300 hover:text-blue-300 font-medium transition-all duration-200 relative group"
                        >
                          Friends
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2.5 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all duration-200 font-medium text-sm bg-red-500/5"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Decorative bottom border glow */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      )}
    </nav>
  );
};

export default Navbar;
