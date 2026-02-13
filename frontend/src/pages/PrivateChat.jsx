import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const PrivateChat = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-5">
        <button
          onClick={() => navigate("/friends")}
          className="mb-6 inline-block px-5 py-2 rounded font-medium transition-all duration-300 cursor-pointer border-none bg-secondary text-white hover:bg-gray-700"
        >
          ← Back to Friends
        </button>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Private Chat Coming Soon
              </h2>
              <p className="text-gray-600">
                WebRTC video/audio integration and private messaging features
                will be implemented soon.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-5 text-left">
              <h3 className="font-bold mb-3">🎉 What's Coming:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Real-time text messaging</li>
                <li>✓ Video and audio calls</li>
                <li>✓ Screen sharing</li>
                <li>✓ Message history</li>
              </ul>
            </div>

            <p className="text-center text-gray-600">Friend ID: {friendId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
