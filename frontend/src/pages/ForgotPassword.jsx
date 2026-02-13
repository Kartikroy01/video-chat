import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email, otp, password, success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setMessage(data.message);
      setStep("otp");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp) {
      setError("Please enter the OTP code");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      setMessage(data.message);
      setStep("password");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please enter both password and confirm password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, password, confirmPassword }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage(data.message);
      setStep("success");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
  };

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
          <div className="text-5xl mb-3">{step === "success" ? "✓" : "🔐"}</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {step === "email" && "Reset Password"}
            {step === "otp" && "Verify OTP"}
            {step === "password" && "New Password"}
            {step === "success" && "Password Reset"}
          </h2>
          <p className="text-slate-300 text-sm">
            {step === "email" &&
              "Enter your email and we'll send you an OTP to reset your password"}
            {step === "otp" && "Enter the 6-digit code we sent to your email"}
            {step === "password" && "Create your new password"}
            {step === "success" && "Your password has been reset successfully"}
          </p>
        </div>

        {step === "success" ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-5 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-xl font-bold text-emerald-300 mb-2">
                Password Reset Complete
              </h3>
              <p className="text-emerald-200 text-sm mb-6">
                Your password has been successfully reset. You can now login
                with your new password.
              </p>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Back to Login →
            </Link>
          </div>
        ) : (
          <form
            onSubmit={
              step === "email"
                ? handleEmailSubmit
                : step === "otp"
                  ? handleOtpSubmit
                  : handlePasswordSubmit
            }
            className="space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">ℹ️</span>
                <p className="text-blue-200 text-sm">{message}</p>
              </div>
            )}

            {/* Email Input */}
            {(step === "email" || step === "otp" || step === "password") && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  disabled={step !== "email"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {/* OTP Input */}
            {(step === "otp" || step === "password") && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength="6"
                  disabled={step !== "otp"}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Check spam folder if no email received
                </p>
              </div>
            )}

            {/* Password Input */}
            {step === "password" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Minimum 6 characters required
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
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
                  {step === "email" && "Sending OTP..."}
                  {step === "otp" && "Verifying OTP..."}
                  {step === "password" && "Resetting Password..."}
                </>
              ) : (
                <>
                  {step === "email" && "Send OTP →"}
                  {step === "otp" && "Verify OTP →"}
                  {step === "password" && "Reset Password →"}
                </>
              )}
            </button>

            {/* Back Button */}
            {(step === "otp" || step === "password") && (
              <button
                type="button"
                onClick={() => {
                  if (step === "password") setStep("otp");
                  else setStep("email");
                  setError("");
                  setMessage("");
                }}
                className="w-full py-3 px-6 rounded-xl bg-slate-600/30 hover:bg-slate-600/50 text-slate-100 font-bold transition-all duration-300 border border-slate-500/30"
              >
                ← Back
              </button>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-slate-800/80 text-slate-400">Or</span>
              </div>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="w-full py-3 px-6 rounded-xl bg-slate-600/30 hover:bg-slate-600/50 text-slate-100 font-bold transition-all duration-300 border border-slate-500/30 flex items-center justify-center gap-2"
            >
              Back to Login
            </Link>

            {/* Register Link */}
            <div className="text-center pt-2">
              <span className="text-slate-400 text-sm">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                Create one
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
