import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-300 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-slate-300 text-lg">
              Welcome back,{" "}
              <span className="text-blue-400 font-semibold">
                {user.name.split(" ")[0]}
              </span>
            </p>
          </div>
          <div className="hidden md:block">
            <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-slate-700/40 backdrop-blur-md border border-slate-600/50 text-sm font-medium text-slate-100 shadow-xl">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Main Profile Card */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <span className="text-9xl">✨</span>
              </div>

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg">
                    <span className="text-xl">👤</span>
                  </span>
                  Profile Overview
                </h2>
                <span
                  className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-bold shadow-lg transition-all ${
                    user.isApproved
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                  }`}
                >
                  {user.isApproved ? "✓ Approved" : "⏳ Pending Verification"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-600/30 rounded-xl p-5 border border-slate-500/30 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2">
                    Full Name
                  </p>
                  <p className="font-semibold text-xl text-white">
                    {user.name}
                  </p>
                </div>
                <div className="bg-slate-600/30 rounded-xl p-5 border border-slate-500/30 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2">
                    Email Address
                  </p>
                  <p
                    className="font-semibold text-lg text-slate-200 truncate"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                </div>
                <div className="bg-slate-600/30 rounded-xl p-5 border border-slate-500/30 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2">
                    Institution
                  </p>
                  <p className="font-semibold text-lg text-slate-200">
                    {user.institutionName}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-5 border border-blue-400/30">
                  <p className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-2">
                    Anonymous Identity
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xl text-blue-300">
                      {user.anonymousName}
                    </p>
                    <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full border border-blue-400/30 font-medium">
                      Public
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Steps (Only if not approved) */}
            {!user.isApproved && (
              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-500"></div>
                <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                  <span className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-lg">
                    📋
                  </span>
                  Verification Progress
                </h2>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-4 top-2 bottom-4 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-slate-600 hidden md:block rounded-full"></div>

                  <div className="space-y-6 relative">
                    {/* Step 1 - Email Verification */}
                    <div className="flex items-start md:items-center gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center border-2 border-emerald-400 font-bold shadow-lg z-10">
                        ✓
                      </div>
                      <div className="flex-1 bg-slate-600/30 rounded-2xl p-5 border border-emerald-500/30 backdrop-blur-sm hover:border-emerald-500/50 transition-all">
                        <p className="font-bold text-white mb-1">
                          Email Verification
                        </p>
                        <p className="text-sm text-slate-300">
                          Your email has been successfully verified.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 - Upload Student ID */}
                    <div className="flex items-start md:items-center gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center border-2 border-blue-400 font-bold shadow-lg shadow-blue-500/50 z-10">
                        2
                      </div>
                      <div className="flex-1 bg-blue-500/20 rounded-2xl p-5 border border-blue-500/50 backdrop-blur-sm ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                        <p className="font-bold text-white mb-1">
                          Upload Student ID
                        </p>
                        <p className="text-sm text-slate-300 mb-4">
                          We need to verify your student status.
                        </p>
                        <Link
                          to="/upload-student-id"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Upload ID Now →
                        </Link>
                      </div>
                    </div>

                    {/* Step 3 - Admin Approval */}
                    <div className="flex items-start md:items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-600 text-slate-400 flex items-center justify-center border-2 border-slate-500 font-bold z-10">
                        3
                      </div>
                      <div className="flex-1 bg-slate-600/20 rounded-2xl p-5 border border-dashed border-slate-500/30 backdrop-blur-sm">
                        <p className="font-bold text-slate-400">
                          Admin Approval
                        </p>
                        <p className="text-sm text-slate-500">
                          Wait for verification confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Action Cards */}
            {user.isApproved ? (
              <>
                {/* Start Chat Card */}
                <div className="bg-gradient-to-br from-blue-600/80 to-cyan-600/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-300 flex flex-col items-center text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    💬
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 relative z-10">
                    Start Chatting
                  </h2>
                  <p className="text-blue-100 mb-8 flex-1 relative z-10 leading-relaxed">
                    Connect with verified students. Anonymous, safe, and
                    engaging conversations await.
                  </p>
                  <Link
                    to="/chat"
                    className="w-full py-4 px-6 rounded-2xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 relative z-10 group/btn"
                  >
                    Enter Chat Room{" "}
                    <span className="group-hover/btn:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>

                {/* My Friends Card */}
                <div className="bg-gradient-to-br from-indigo-600/80 to-purple-600/80 backdrop-blur-xl rounded-3xl p-6 border border-indigo-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-5 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                    👥
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="font-bold text-lg text-white">My Friends</h3>
                    <p className="text-indigo-100 text-sm">
                      View and manage your connections
                    </p>
                  </div>
                  <Link
                    to="/friends"
                    className="w-11 h-11 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/50 transition-all relative z-10"
                  >
                    →
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 shadow-xl text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Features Locked
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Complete verification to unlock chat and friend features.
                </p>
              </div>
            )}

            {/* Admin Panel Card */}
            {user.role === "admin" && (
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group border border-slate-600/50">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-7xl group-hover:opacity-10 transition-opacity duration-500">
                  🔧
                </div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 relative z-10">
                  <span className="text-2xl">🛡️</span> Admin Controls
                </h2>
                <p className="text-slate-400 text-sm mb-6 relative z-10">
                  Manage users, approve IDs, and monitor activities.
                </p>
                <Link
                  to="/admin"
                  className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500/30 to-cyan-500/30 hover:from-blue-500/50 hover:to-cyan-500/50 border border-blue-400/50 text-center font-bold text-white transition-all backdrop-blur-sm relative z-10"
                >
                  Open Admin Dashboard →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features / About Section */}
        {user.isApproved && (
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-bold text-white">
                Why StudentConnect?
              </h2>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 flex-1 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🔐",
                  title: "Private",
                  desc: "Your identity is hidden. Chat without worry.",
                  gradient: "from-purple-500/20 to-pink-500/20",
                  border: "border-purple-400/30",
                },
                {
                  icon: "🎓",
                  title: "Verified",
                  desc: "Only real students from your institution.",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  border: "border-blue-400/30",
                },
                {
                  icon: "🤝",
                  title: "Connect",
                  desc: "Make lasting friendships easily.",
                  gradient: "from-green-500/20 to-emerald-500/20",
                  border: "border-green-400/30",
                },
                {
                  icon: "🛡️",
                  title: "Safe",
                  desc: "Community moderated for safety.",
                  gradient: "from-orange-500/20 to-red-500/20",
                  border: "border-orange-400/30",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-6 rounded-2xl border ${item.border} shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-opacity-50`}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-white mb-2 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
