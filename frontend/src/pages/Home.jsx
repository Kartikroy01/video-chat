import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background Elements - Glowing Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading text-white mb-6 tracking-tight animate-fade-in leading-tight">
            Connect with Students <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600">
              Anonymously & Safely
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in opacity-90">
            Join the exclusive community for verified students. Meet new people,
            share ideas, and build meaningful connections without revealing your
            identity until you're ready.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-cyan-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-lg"
                >
                  Get Started for Free →
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-slate-700/50 text-white font-bold rounded-xl border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm text-lg"
                >
                  Login to Account
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-cyan-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-lg"
              >
                Go to Dashboard →
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-slate-400 text-sm">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">50K+</div>
              <div className="text-slate-400 text-sm">Connections Made</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100+</div>
              <div className="text-slate-400 text-sm">Universities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 backdrop-blur-sm border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why Choose StudentConnect?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We've built a platform specifically for university students to
              connect in a safe, verified environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔐"
              title="Verified Students Only"
              desc="Every user is verified via their university email (.edu, .ac.in), ensuring a genuine community."
            />
            <FeatureCard
              icon="🕶️"
              title="Anonymous Identity"
              desc="Chat without pressure. Reveal your identity only when you feel comfortable and safe."
            />
            <FeatureCard
              icon="💬"
              title="Random Matching"
              desc="Break out of your social bubble. Get matched with students from different majors and backgrounds."
            />
            <FeatureCard
              icon="👥"
              title="Build Friendships"
              desc="Found a connection? Send a friend request to keep in touch and chat anytime."
            />
            <FeatureCard
              icon="🎥"
              title="Video & Audio Chat"
              desc="Take the conversation to the next level with high-quality video and audio calls."
            />
            <FeatureCard
              icon="🛡️"
              title="Safe & Moderated"
              desc="Our community guidelines and moderation tools ensure a respectful and safe environment."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white">
            How It Works
          </h2>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              <StepCard
                number="1"
                title="Register"
                desc="Sign up with your student email"
              />
              <StepCard
                number="2"
                title="Verify"
                desc="Confirm your email address"
              />
              <StepCard
                number="3"
                title="Upload ID"
                desc="Verify your student status"
              />
              <StepCard
                number="4"
                title="Approval"
                desc="Wait for admin verification"
              />
              <StepCard
                number="5"
                title="Connect"
                desc="Start matching & chatting"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-slate-300 py-12 border-t border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
            💬 Zocialin
          </div>
          <p className="mb-8 text-slate-400">
            Connecting students worldwide, one conversation at a time.
          </p>
          <div className="border-t border-slate-700/50 pt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Zocialin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-8 rounded-2xl backdrop-blur-xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
    <div className="text-4xl mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-6 rounded-xl backdrop-blur-md border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 relative hover:shadow-2xl hover:shadow-blue-500/10">
    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg shadow-blue-500/50">
      {number}
    </div>
    <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
    <p className="text-sm text-slate-400">{desc}</p>
  </div>
);

export default Home;
