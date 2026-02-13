import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth(); // Destructure logout from useAuth
  const navigate = useNavigate(); // Add navigate hook

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingRes, reportsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/dashboard", { headers }),
        axios.get("http://localhost:5000/api/admin/pending-approvals", {
          headers,
        }),
        axios.get("http://localhost:5000/api/admin/reports", { headers }),
        axios.get("http://localhost:5000/api/admin/all-users", { headers }),
      ]);

      setStats(statsRes.data.stats);
      setPendingUsers(pendingRes.data.users);
      setReports(reportsRes.data.reports || []);
      setAllUsers(usersRes.data.users || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      // alert("Error loading admin data");
    } finally {
      setLoading(false);
    }
  };


  const handleApproveUser = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/approve-user",
        { userId },
        { headers },
      );
      alert("User approved successfully");
      fetchAdminData();
    } catch (err) {
      alert("Error approving user");
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/ban-user",
        { userId, reason: "Admin action" },
        { headers },
      );
      alert("User status updated successfully");
      fetchAdminData();
    } catch (err) {
      alert("Error updating user status");
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/resolve-report",
        { reportId, status, adminNotes: "Reviewed from Dashboard" },
        { headers },
      );
      alert("Report resolved");
      fetchAdminData();
    } catch (err) {
      alert("Error resolving report");
    }
  };

  const handleLogout = () => {
      logout();
      navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Sidebar Component
  const SidebarItem = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
        activeTab === id
          ? "bg-blue-600 text-white border-r-4 border-blue-800"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center justify-center border-b border-gray-800 bg-gray-900">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">
            ZOCIALIN<span className="text-white font-light">ADMIN</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1">
            <SidebarItem id="dashboard" label="Overview" icon="📊" />
            <SidebarItem id="approvals" label="Approvals" icon="✅" />
            <SidebarItem id="reports" label="Reports" icon="🚨" />
            <SidebarItem id="users" label="All Users" icon="👥" />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            <span>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <div className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace("-", " ")}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
               <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                 A
               </div>
               <span className="text-sm font-medium text-gray-600">Administrator</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
            
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && stats && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Users", value: stats.totalUsers, color: "blue", icon: "👥" },
                  { label: "Pending Approvals", value: stats.pendingApprovals, color: "orange", icon: "⏳" },
                  { label: "Active Reports", value: stats.pendingReports, color: "red", icon: "⚠️" },
                  { label: "Online Now", value: stats.onlineUsers, color: "green", icon: "🟢" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
                    <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mr-4 text-2xl`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity Section (Placeholder) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions Required</h3>
                <div className="flex gap-4">
                   {stats.pendingApprovals > 0 ? (
                      <button onClick={() => setActiveTab("approvals")} className="px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 font-medium">
                         Process {stats.pendingApprovals} Approvals →
                      </button>
                   ) : (
                      <p className="text-gray-500 text-sm">No pending approvals.</p>
                   )}
                   
                   {stats.pendingReports > 0 ? (
                      <button onClick={() => setActiveTab("reports")} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium">
                         Review {stats.pendingReports} Reports →
                      </button>
                   ) : (
                      <p className="text-gray-500 text-sm">No pending reports.</p>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* Approvals View */}
          {activeTab === "approvals" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700">Pending Student Identifications</h3>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-bold">{pendingUsers.length} Pending</span>
              </div>
              
              {pendingUsers.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">🎉 All clear! No pending approvals.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <th className="px-6 py-3 font-medium border-b">Student Name</th>
                        <th className="px-6 py-3 font-medium border-b">Institution</th>
                        <th className="px-6 py-3 font-medium border-b">ID Document</th>
                        <th className="px-6 py-3 font-medium border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{user.institutionName}</div>
                            <div className="text-xs text-gray-500">{user.course} ({user.year})</div>
                          </td>
                          <td className="px-6 py-4">
                            {user.studentIdImage ? (
                              <a
                                href={user.studentIdImage.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              >
                                📄 View ID
                              </a>
                            ) : (
                              <span className="text-red-500 text-xs italic">No ID Uploaded</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleApproveUser(user._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reports View */}
          {activeTab === "reports" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-700">Reported Incidents</h3>
              </div>
              
              {reports.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                   <p className="text-lg">🛡️ Safe environment! No active reports.</p>
                </div>
              ) : (
                 <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <th className="px-6 py-3 font-medium border-b">Reported User</th>
                        <th className="px-6 py-3 font-medium border-b">Reason</th>
                        <th className="px-6 py-3 font-medium border-b">Reporter</th>
                        <th className="px-6 py-3 font-medium border-b">Status</th>
                        <th className="px-6 py-3 font-medium border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reports.map((report) => (
                        <tr key={report._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                             {report.reportedUser?.email || "Unknown User"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                             <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-bold mr-2 uppercase">{report.reason}</span>
                             <br/>
                             <span className="text-xs text-gray-500 mt-1 block max-w-xs truncate">{report.description || "No description provided"}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                             {report.reporter?.email || "Anonymous"}
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                {report.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            {report.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleResolveReport(report._id, "action-taken")}
                                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-bold"
                                >
                                  Action
                                </button>
                                <button
                                  onClick={() => handleResolveReport(report._id, "dismissed")}
                                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-xs font-bold"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
              )}
            </div>
          )}

          {/* Users View */}
          {activeTab === "users" && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between">
                <h3 className="font-bold text-gray-700">User Management</h3>
                 <input type="text" placeholder="Search users..." className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" disabled />
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <th className="px-6 py-3 font-medium border-b">Name</th>
                        <th className="px-6 py-3 font-medium border-b">Email</th>
                        <th className="px-6 py-3 font-medium border-b">Registered</th>
                        <th className="px-6 py-3 font-medium border-b">Status</th>
                        <th className="px-6 py-3 font-medium border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                             {user.name}
                             {user.role === 'admin' && <span className="ml-2 px-1 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded uppercase font-bold">Admin</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                             {user.email}
                          </td>
                           <td className="px-6 py-4 text-sm text-gray-500">
                             {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex gap-2">
                               {user.isApproved ? (
                                   <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Approved</span>
                               ) : (
                                   <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">Pending</span>
                               )}
                               {user.isBanned && (
                                   <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">BANNED</span>
                               )}
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             {user.role !== 'admin' && (
                                <button
                                onClick={() => handleBanUser(user._id)}
                                className={`text-xs font-bold px-3 py-1 rounded transition-colors ${user.isBanned ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                >
                                {user.isBanned ? "Unban User" : "Ban User"}
                                </button>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};


export default AdminDashboard;
