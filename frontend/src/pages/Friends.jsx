import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("friends");

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const header = { Authorization: `Bearer ${token}` };

      const [friendsRes, requestsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/chat/friends", {
          headers: header,
        }),
        axios.get("http://localhost:5000/api/chat/pending-requests", {
          headers: header,
        }),
      ]);

      setFriends(friendsRes.data.friends || []);
      setPendingRequests(requestsRes.data.pendingRequests || []);
    } catch (err) {
      setError("Error loading friends");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (senderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/chat/accept-friend-request",
        { senderId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchFriendsData();
    } catch (err) {
      alert("Error accepting request");
    }
  };

  const handleRejectRequest = async (senderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/chat/reject-friend-request",
        { senderId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchFriendsData();
    } catch (err) {
      alert("Error rejecting request");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <div className="w-10 h-10 border-4 border-light border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading friends...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-5">
        <h1 className="text-4xl font-bold mb-8">Friends</h1>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            className={`pb-4 px-4 font-medium border-b-2 transition-all ${
              activeTab === "friends"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            👥 Friends ({friends.length})
          </button>
          <button
            className={`pb-4 px-4 font-medium border-b-2 transition-all ${
              activeTab === "requests"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            📬 Pending Requests ({pendingRequests.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 border border-red-400 p-4 rounded mb-5">
            {error}
          </div>
        )}

        {activeTab === "friends" && (
          <div>
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No friends yet. Start chatting and send friend requests!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="mb-4">
                      <h3 className="font-bold text-lg">
                        {friend.anonymousName}
                      </h3>
                      <p className="text-gray-600">{friend.institutionName}</p>
                    </div>
                    <Link
                      to={`/private-chat/${friend._id}`}
                      className="inline-block px-5 py-2 rounded font-medium transition-all duration-300 cursor-pointer border-none bg-primary text-white hover:bg-blue-700"
                    >
                      💬 Message
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No pending friend requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.senderId._id}
                    className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-lg">
                        {request.senderId.anonymousName}
                      </h3>
                      <p className="text-gray-600">
                        {request.senderId.institutionName}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleAcceptRequest(request.senderId._id)
                        }
                        className="inline-block px-5 py-2 rounded font-medium transition-all duration-300 cursor-pointer border-none bg-success text-white hover:bg-green-700"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() =>
                          handleRejectRequest(request.senderId._id)
                        }
                        className="inline-block px-5 py-2 rounded font-medium transition-all duration-300 cursor-pointer border-none bg-danger text-white hover:bg-red-700"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
