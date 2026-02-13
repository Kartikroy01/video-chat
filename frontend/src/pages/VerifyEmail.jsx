import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await verifyEmail(email, otp);
      setSuccess(result.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Verification failed. Please check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[30%] left-[30%] w-[40rem] h-[40rem] bg-indigo-200/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[35rem] h-[35rem] bg-violet-200/30 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-md w-full glass p-8 rounded-2xl animate-fade-in text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-3xl font-bold font-heading text-slate-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-slate-600 mb-8">
          We've sent a 6-digit code to your email.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 border border-green-200 p-4 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@university.edu"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
              maxLength={6}
              className="input-field text-center text-2xl tracking-widest font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6 || !email}
            className="w-full btn btn-primary flex justify-center py-3"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/60">
          <p className="text-sm text-slate-600 mb-4">
            Didn't receive the code?
          </p>
          <button
            className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
            onClick={() => alert("Resend feature coming soon!")}
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
