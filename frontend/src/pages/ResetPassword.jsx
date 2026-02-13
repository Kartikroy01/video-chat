import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);
      setFormData({ password: "", confirmPassword: "" });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="max-w-md w-full bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 shadow-2xl text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
          <p className="text-slate-300 mb-6">
            The password reset link is missing or invalid.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔑</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Create New Password
          </h2>
          <p className="text-slate-300 text-sm">
            Enter your new password below to regain access to your account
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">✓</div>
              <h3 className="text-xl font-bold text-emerald-300 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-emerald-200 text-sm">
                Your password has been successfully reset. Redirecting to
                login...
              </p>
            </div>

            {/* Manual Login Link */}
            <Link
              to="/login"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Go to Login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {formData.password && formData.password.length < 6 && (
                <p className="text-amber-400 text-xs mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Password strength indicator */}
            {formData.password && (
              <div className="p-3 bg-slate-600/20 rounded-lg border border-slate-500/30">
                <p className="text-xs text-slate-400 mb-2">
                  Password strength:
                </p>
                <div className="w-full bg-slate-600/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      formData.password.length >= 12
                        ? "bg-emerald-500 w-full"
                        : formData.password.length >= 8
                          ? "bg-yellow-500 w-2/3"
                          : "bg-red-500 w-1/3"
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !formData.password ||
                formData.password !== formData.confirmPassword
              }
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting...
                </>
              ) : (
                <>Reset Password →</>
              )}
            </button>

            {/* Back to Login */}
            <Link
              to="/login"
              className="w-full py-3 px-6 rounded-xl bg-slate-600/30 hover:bg-slate-600/50 text-slate-100 font-bold transition-all duration-300 border border-slate-500/30 flex items-center justify-center gap-2"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
