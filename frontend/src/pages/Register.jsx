import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    institutionName: "",
    course: "",
    year: "1st",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.institutionName ||
      !formData.course
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate student email
    const emailDomains = ["edu", "ac.in"];
    const emailDomain = formData.email.split("@")[1];
    const isValidDomain = emailDomains.some((domain) =>
      emailDomain?.endsWith(domain),
    );

    if (!isValidDomain) {
      setError(
        "Please use a valid student email (.edu, .ac.in, or university domain)",
      );
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        institutionName: formData.institutionName,
        course: formData.course,
        year: formData.year,
      });

      // Show success message and redirect to verification page
      alert(result.message);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      onClick={handleBackdropClick}
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-xl w-full bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors duration-200 text-2xl font-light hover:bg-slate-600/30 rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💬</div>
          <h2 className="text-3xl font-bold font-heading text-white">
            Create Account
          </h2>
          <p className="text-slate-300 mt-2">
            Join verified students from your institution
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center text-sm gap-3">
            <span>⚠️</span> {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Student Email * (.edu, .ac.in)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@university.edu"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Institution Name *
              </label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="University Name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Course/Program *
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g., B.Tech"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Year *
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
            >
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="5th">5th Year</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-500/30 bg-slate-600/30 focus:bg-slate-600/50 focus:border-blue-500 text-white placeholder-slate-400 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
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
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-500/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-slate-800/80 text-slate-400">Or</span>
          </div>
        </div>

        <p className="text-center text-slate-300 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
