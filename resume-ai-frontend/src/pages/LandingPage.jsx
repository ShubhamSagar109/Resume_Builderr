import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBrain,
  FaCheckCircle,
  FaFileAlt,
  FaMagic,
  FaRocket,
  FaStar,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* ================= NAVBAR ================= */}
      <div className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-50 border-b border-base-300">
        <div className="container mx-auto px-4">
          {/* Logo */}
          <div className="flex-1">
            <Link
              to="/"
              className="flex items-center gap-3 text-xl font-bold"
            >
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-lg">
                <FaBrain className="text-lg" />
              </div>

              <span>
                Resume<span className="text-primary">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#features" className="btn btn-ghost">
              Features
            </a>

            <a href="#how-it-works" className="btn btn-ghost">
              How It Works
            </a>

            <Link
              to="/generate-resume"
              className="btn btn-primary rounded-xl px-6"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-base-200">
        {/* Background Decorations */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="absolute top-40 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
                <FaMagic />
                <span className="text-sm font-semibold">
                  AI-Powered Resume Builder
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                Build a Resume That
                <span className="text-primary block">
                  Gets You Noticed.
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl opacity-70 max-w-xl leading-relaxed">
                Describe your skills, experience, and career goals. Our AI
                transforms your information into a professional,
                job-ready resume in minutes.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/generate-resume"
                  className="btn btn-primary btn-lg rounded-xl px-8 shadow-xl hover:scale-105 transition-transform"
                >
                  Create My Resume
                  <FaArrowRight />
                </Link>

                <a
                  href="#how-it-works"
                  className="btn btn-outline btn-lg rounded-xl px-8"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm opacity-70">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success" />
                  AI Generated
                </div>

                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success" />
                  Professional Format
                </div>

                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success" />
                  Easy to Edit
                </div>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>

              <div className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-300 p-6 md:p-8 rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Fake Resume */}
                <div className="flex justify-between items-start border-b border-base-300 pb-5">
                  <div>
                    <div className="h-5 w-40 bg-base-content/80 rounded mb-2"></div>
                    <div className="h-3 w-56 bg-base-content/20 rounded"></div>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaFileAlt className="text-primary text-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5 mt-6">
                  <div className="col-span-2 space-y-4">
                    <div>
                      <div className="h-3 w-24 bg-primary rounded mb-3"></div>

                      <div className="space-y-2">
                        <div className="h-2 w-full bg-base-300 rounded"></div>
                        <div className="h-2 w-11/12 bg-base-300 rounded"></div>
                        <div className="h-2 w-10/12 bg-base-300 rounded"></div>
                      </div>
                    </div>

                    <div>
                      <div className="h-3 w-28 bg-primary rounded mb-3"></div>

                      <div className="space-y-2">
                        <div className="h-2 w-full bg-base-300 rounded"></div>
                        <div className="h-2 w-10/12 bg-base-300 rounded"></div>
                        <div className="h-2 w-9/12 bg-base-300 rounded"></div>
                      </div>
                    </div>

                    <div>
                      <div className="h-3 w-20 bg-primary rounded mb-3"></div>

                      <div className="space-y-2">
                        <div className="h-2 w-full bg-base-300 rounded"></div>
                        <div className="h-2 w-11/12 bg-base-300 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="h-3 w-16 bg-primary rounded mb-3"></div>

                      <div className="flex flex-wrap gap-2">
                        <div className="h-5 w-12 bg-base-300 rounded"></div>
                        <div className="h-5 w-14 bg-base-300 rounded"></div>
                        <div className="h-5 w-10 bg-base-300 rounded"></div>
                        <div className="h-5 w-16 bg-base-300 rounded"></div>
                      </div>
                    </div>

                    <div>
                      <div className="h-3 w-20 bg-primary rounded mb-3"></div>

                      <div className="space-y-2">
                        <div className="h-2 w-full bg-base-300 rounded"></div>
                        <div className="h-2 w-10/12 bg-base-300 rounded"></div>
                        <div className="h-2 w-11/12 bg-base-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="absolute -bottom-5 -left-5 bg-base-100 shadow-xl border border-base-300 rounded-xl px-5 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary text-primary-content flex items-center justify-center">
                    <FaBrain />
                  </div>

                  <div>
                    <p className="font-bold text-sm">AI Optimized</p>
                    <p className="text-xs opacity-60">
                      Professional Resume
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-base-300 bg-base-100">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-primary">AI</h3>
              <p className="text-sm opacity-60 mt-1">Powered Creation</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">10x</h3>
              <p className="text-sm opacity-60 mt-1">Faster Resume Building</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">100%</h3>
              <p className="text-sm opacity-60 mt-1">Editable Content</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">1</h3>
              <p className="text-sm opacity-60 mt-1">Simple Workflow</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Powerful Features
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Everything You Need to Build a Better Resume
            </h2>

            <p className="mt-5 opacity-70 text-lg">
              Create a polished resume without spending hours formatting and
              rewriting your information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group card bg-base-200 border border-base-300 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="card-body p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <FaBrain />
                </div>

                <h3 className="card-title text-2xl mt-4">
                  AI-Powered Generation
                </h3>

                <p className="opacity-70 leading-relaxed">
                  Simply describe yourself and let AI organize your
                  information into a professional resume structure.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group card bg-base-200 border border-base-300 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="card-body p-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <FaFileAlt />
                </div>

                <h3 className="card-title text-2xl mt-4">
                  Professional Structure
                </h3>

                <p className="opacity-70 leading-relaxed">
                  Get organized sections for your skills, education,
                  experience, projects, achievements, and more.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group card bg-base-200 border border-base-300 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="card-body p-8">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <FaRocket />
                </div>

                <h3 className="card-title text-2xl mt-4">
                  Easy to Customize
                </h3>

                <p className="opacity-70 leading-relaxed">
                  Review the generated information, edit anything you want,
                  and create a resume that represents you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="py-24 bg-base-200 border-y border-base-300"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Simple Process
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Create Your Resume in 3 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl font-bold shadow-lg">
                1
              </div>

              <h3 className="text-xl font-bold mt-6">
                Describe Yourself
              </h3>

              <p className="opacity-70 mt-3 leading-relaxed">
                Enter your education, skills, experience, projects, and career
                goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl font-bold shadow-lg">
                2
              </div>

              <h3 className="text-xl font-bold mt-6">
                Let AI Build It
              </h3>

              <p className="opacity-70 mt-3 leading-relaxed">
                Our AI organizes your information into a structured
                professional resume.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl font-bold shadow-lg">
                3
              </div>

              <h3 className="text-xl font-bold mt-6">
                Review & Customize
              </h3>

              <p className="opacity-70 mt-3 leading-relaxed">
                Review your generated resume, make changes, and create your
                final version.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              User Experience
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Built to Make Resume Creation Easier
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="card bg-base-200 border border-base-300 shadow-xl">
              <div className="card-body p-8 md:p-12 text-center">
                <div className="flex justify-center gap-1 text-warning mb-5">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed">
                  "Describe your experience once and let AI turn it into a
                  professional resume structure."
                </blockquote>

                <div className="mt-7">
                  <p className="font-bold">AI Resume Builder</p>
                  <p className="text-sm opacity-60">
                    Simple. Professional. AI-powered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-primary text-primary-content">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-content/10 flex items-center justify-center text-3xl mb-6">
              <FaMagic />
            </div>

            <h2 className="text-4xl md:text-5xl font-black">
              Ready to Build Your Resume?
            </h2>

            <p className="mt-5 text-lg opacity-90">
              Turn your skills and experience into a professional resume with
              the help of AI.
            </p>

            <Link
              to="/generate-resume"
              className="btn btn-lg bg-base-100 text-base-content hover:bg-base-200 border-none rounded-xl mt-8 px-10"
            >
              Start Building Now
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-base-300">
        <div className="container mx-auto px-6 py-14">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <Link
                to="/"
                className="flex items-center gap-3 text-xl font-bold"
              >
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center">
                  <FaBrain />
                </div>

                Resume<span className="text-primary">AI</span>
              </Link>

              <p className="mt-4 opacity-60 max-w-sm leading-relaxed">
                Build professional resumes faster with AI-powered resume
                generation.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold mb-4">Product</h3>

              <div className="flex flex-col gap-3 opacity-70">
                <a href="#features" className="hover:text-primary">
                  Features
                </a>

                <a href="#how-it-works" className="hover:text-primary">
                  How It Works
                </a>

                <Link
                  to="/generate-resume"
                  className="hover:text-primary"
                >
                  Create Resume
                </Link>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="font-bold mb-4">About</h3>

              <div className="flex flex-col gap-3 opacity-70">
                <a href="#" className="hover:text-primary">
                  About Us
                </a>

                <a href="#" className="hover:text-primary">
                  Privacy Policy
                </a>

                <a href="#" className="hover:text-primary">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-base-content/10 mt-10 pt-6 text-center text-sm opacity-50">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;