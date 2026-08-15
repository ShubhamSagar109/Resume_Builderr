import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

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
    <div className="min-h-screen bg-white text-gray-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="bg-gray-50 border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}
            <div className="max-w-xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600">
                <FaMagic />
                AI-Powered Resume Builder
              </div>

              {/* Heading */}
              <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Build a Professional Resume
                <span className="block text-pink-600">
                  With AI.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 md:text-lg">
                Describe your skills, education, experience, and career
                goals. Our AI helps you turn your information into a
                professional, job-ready resume.
              </p>

              {/* Buttons */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/generate-resume"
                  className="btn h-12 rounded-lg border-0 bg-pink-600 px-6 text-white hover:bg-pink-700"
                >
                  Create My Resume
                  <FaArrowRight />
                </Link>

                <a
                  href="#how-it-works"
                  className="btn h-12 rounded-lg border border-gray-300 bg-white px-6 text-gray-700 hover:bg-gray-100"
                >
                  See How It Works
                </a>

              </div>

              {/* Trust Points */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  AI Generated
                </div>

                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Professional Format
                </div>

                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Easy to Edit
                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT RESUME PREVIEW
            ================================================= */}
            <div className="flex justify-center">

              <div className="w-full max-w-[620px]">

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg md:p-7">

                  {/* Resume Header */}
                  <div className="flex items-start justify-between border-b border-gray-200 pb-5">

                    <div className="min-w-0">

                      <div className="h-5 w-44 rounded bg-gray-800" />

                      <div className="mt-3 h-2.5 w-56 max-w-full rounded bg-gray-300" />

                      <div className="mt-4 flex flex-wrap gap-2">

                        <div className="h-1.5 w-16 rounded bg-gray-200" />
                        <div className="h-1.5 w-20 rounded bg-gray-200" />
                        <div className="h-1.5 w-14 rounded bg-gray-200" />

                      </div>

                    </div>

                    <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pink-50">
                      <FaFileAlt className="text-xl text-pink-600" />
                    </div>

                  </div>

                  {/* Resume Body */}
                  <div className="mt-6 grid grid-cols-12 gap-6">

                    {/* Main Column */}
                    <div className="col-span-8 space-y-6">

                      {/* Summary */}
                      <div>

                        <div className="mb-3 h-2.5 w-24 rounded bg-pink-600" />

                        <div className="space-y-2.5">
                          <div className="h-2 w-full rounded bg-gray-200" />
                          <div className="h-2 w-11/12 rounded bg-gray-200" />
                          <div className="h-2 w-10/12 rounded bg-gray-200" />
                          <div className="h-2 w-8/12 rounded bg-gray-200" />
                        </div>

                      </div>

                      {/* Experience */}
                      <div>

                        <div className="mb-3 h-2.5 w-28 rounded bg-pink-600" />

                        <div className="mb-4">

                          <div className="mb-2.5 h-2.5 w-40 rounded bg-gray-700" />

                          <div className="space-y-2">
                            <div className="h-2 w-full rounded bg-gray-200" />
                            <div className="h-2 w-11/12 rounded bg-gray-200" />
                            <div className="h-2 w-9/12 rounded bg-gray-200" />
                          </div>

                        </div>

                        <div>

                          <div className="mb-2.5 h-2.5 w-32 rounded bg-gray-700" />

                          <div className="space-y-2">
                            <div className="h-2 w-full rounded bg-gray-200" />
                            <div className="h-2 w-10/12 rounded bg-gray-200" />
                          </div>

                        </div>

                      </div>

                      {/* Projects */}
                      <div>

                        <div className="mb-3 h-2.5 w-20 rounded bg-pink-600" />

                        <div className="space-y-2.5">
                          <div className="h-2 w-full rounded bg-gray-200" />
                          <div className="h-2 w-11/12 rounded bg-gray-200" />
                          <div className="h-2 w-8/12 rounded bg-gray-200" />
                        </div>

                      </div>

                    </div>

                    {/* Sidebar */}
                    <div className="col-span-4 space-y-6 border-l border-gray-200 pl-5">

                      {/* Skills */}
                      <div>

                        <div className="mb-3 h-2.5 w-16 rounded bg-pink-600" />

                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 w-14 rounded bg-gray-100" />
                          <div className="h-6 w-16 rounded bg-gray-100" />
                          <div className="h-6 w-12 rounded bg-gray-100" />
                          <div className="h-6 w-20 rounded bg-gray-100" />
                          <div className="h-6 w-16 rounded bg-gray-100" />
                        </div>

                      </div>

                      {/* Education */}
                      <div>

                        <div className="mb-3 h-2.5 w-20 rounded bg-pink-600" />

                        <div className="space-y-2.5">
                          <div className="h-2 w-full rounded bg-gray-200" />
                          <div className="h-2 w-10/12 rounded bg-gray-200" />
                          <div className="h-2 w-11/12 rounded bg-gray-200" />
                        </div>

                      </div>

                      {/* Certifications */}
                      <div>

                        <div className="mb-3 h-2.5 w-20 rounded bg-pink-600" />

                        <div className="space-y-2.5">
                          <div className="h-2 w-9/12 rounded bg-gray-200" />
                          <div className="h-2 w-full rounded bg-gray-200" />
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="border-b border-gray-200 bg-white">

        <div className="max-w-6xl mx-auto px-6 py-9">

          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">

            <div>
              <h3 className="text-2xl font-bold text-pink-600">
                AI
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Powered Creation
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                10x
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Faster Resume Building
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                100%
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Editable Content
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                1
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Simple Workflow
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section
        id="features"
        className="bg-gray-50 py-20"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-sm font-semibold text-pink-600">
              Powerful Features
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Everything You Need
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Create a polished resume without spending hours formatting
              and rewriting your information.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-xl border border-gray-200 bg-white">

              <div className="p-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 text-xl text-pink-600">
                  <FaBrain />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  AI-Powered Generation
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Simply describe yourself and let AI organize your
                  information into a professional resume structure.
                </p>

              </div>

            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-gray-200 bg-white">

              <div className="p-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 text-xl text-yellow-600">
                  <FaFileAlt />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Professional Structure
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Get organized sections for your skills, education,
                  experience, projects, achievements, and more.
                </p>

              </div>

            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-gray-200 bg-white">

              <div className="p-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-xl text-orange-500">
                  <FaRocket />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Easy to Customize
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Review the generated information, edit anything you
                  want, and create a resume that represents you.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section
        id="how-it-works"
        className="border-y border-gray-200 bg-white py-20"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="mb-14 text-center">

            <span className="text-sm font-semibold text-pink-600">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Create Your Resume in 3 Steps
            </h2>

          </div>

          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">

            {/* Step 1 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-600 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Describe Yourself
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Enter your education, skills, experience, projects, and
                career goals.
              </p>

            </div>

            {/* Step 2 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-600 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Let AI Build It
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Our AI organizes your information into a structured
                professional resume.
              </p>

            </div>

            {/* Step 3 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-600 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Review & Customize
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Review your generated resume, make changes, and create
                your final version.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIAL
      ===================================================== */}
      <section className="bg-gray-50 py-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="mb-12 text-center">

            <span className="text-sm font-semibold text-pink-600">
              User Experience
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Built to Make Resume Creation Easier
            </h2>

          </div>

          <div className="mx-auto max-w-3xl">

            <div className="rounded-xl border border-gray-200 bg-white">

              <div className="p-8 text-center md:p-10">

                <div className="mb-5 flex justify-center gap-1 text-yellow-500">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <blockquote className="text-lg font-medium leading-7 text-gray-700 md:text-xl">
                  "Describe your experience once and let AI turn it into a
                  professional resume structure."
                </blockquote>

                <div className="mt-6">

                  <p className="text-sm font-bold text-gray-900">
                    AI Resume Builder
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Simple. Professional. AI-powered.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="bg-pink-600 py-20 text-white">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-2xl">
            <FaMagic />
          </div>

          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Build Your Resume?
          </h2>

          <p className="mt-4 text-base leading-7 text-white/90 md:text-lg">
            Turn your skills and experience into a professional resume
            with the help of AI.
          </p>

          <Link
            to="/generate-resume"
            className="btn mt-7 h-12 rounded-lg border-none bg-white px-8 text-sm font-semibold text-pink-600 hover:bg-gray-100"
          >
            Start Building Now
            <FaArrowRight />
          </Link>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-gray-200 bg-gray-900 text-white">

        <div className="max-w-6xl mx-auto px-6 py-12">

          <div className="grid gap-10 md:grid-cols-3">

            {/* Brand */}
            <div>

              <Link
                to="/"
                className="flex items-center gap-3 text-lg font-bold"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-600 text-white">
                  <FaBrain />
                </div>

                Resume<span className="text-pink-400">AI</span>

              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
                Build professional resumes faster with AI-powered resume
                generation.
              </p>

            </div>

            {/* Product */}
            <div>

              <h3 className="mb-4 text-sm font-bold">
                Product
              </h3>

              <div className="flex flex-col gap-3 text-sm text-gray-400">

                <a
                  href="#features"
                  className="hover:text-pink-400"
                >
                  Features
                </a>

                <a
                  href="#how-it-works"
                  className="hover:text-pink-400"
                >
                  How It Works
                </a>

                <Link
                  to="/generate-resume"
                  className="hover:text-pink-400"
                >
                  Create Resume
                </Link>

              </div>

            </div>

            {/* About */}
            <div>

              <h3 className="mb-4 text-sm font-bold">
                About
              </h3>

              <div className="flex flex-col gap-3 text-sm text-gray-400">

                <a
                  href="#"
                  className="hover:text-pink-400"
                >
                  About Us
                </a>

                <a
                  href="#"
                  className="hover:text-pink-400"
                >
                  Privacy Policy
                </a>

                <a
                  href="#"
                  className="hover:text-pink-400"
                >
                  Terms of Service
                </a>

              </div>

            </div>

          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;
