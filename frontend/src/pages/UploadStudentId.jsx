import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UploadStudentId = () => {
  const navigate = useNavigate();
  const { uploadStudentId } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only image files are allowed (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await uploadStudentId(file);
      setSuccess(result.message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-5">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">Upload Student ID</h1>
          <p className="text-gray-600 mb-6">
            Verify your student status by uploading a clear image of your
            student ID card
          </p>

          {error && (
            <div className="bg-red-100 text-red-800 border border-red-400 p-4 rounded mb-5">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-800 border border-green-400 p-4 rounded mb-5">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-4 font-medium">
                Student ID Card Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-blue-50 transition-colors">
                <input
                  type="file"
                  id="studentId"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label htmlFor="studentId" className="cursor-pointer block">
                  <span className="text-4xl mb-2 block">📸</span>
                  <span className="block font-medium text-gray-700">
                    Click to upload or drag and drop
                  </span>
                  <span className="block text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </label>
              </div>
            </div>

            {preview && (
              <div className="mb-5">
                <h3 className="font-bold mb-3">Preview</h3>
                <img
                  src={preview}
                  alt="Student ID Preview"
                  className="max-w-full h-auto rounded-lg shadow border border-gray-300"
                />
              </div>
            )}

            <div className="mb-5 bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-bold mb-3">Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Clear image of both sides of your student ID</li>
                <li>✓ ID number must be visible</li>
                <li>✓ Your name on ID must match registration</li>
                <li>✓ No blurred or cropped images</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full px-5 py-2 rounded font-medium transition-all duration-300 cursor-pointer border-none bg-primary text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-5"
              disabled={loading || !file}
            >
              {loading ? "Uploading..." : "Upload Student ID"}
            </button>
          </form>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-600 space-y-1">
            <p>
              After uploading, your document will be reviewed by our admin team.
            </p>
            <p>
              Approval typically takes 24-48 hours. You'll receive an email once
              approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStudentId;
