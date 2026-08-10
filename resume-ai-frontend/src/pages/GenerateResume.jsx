import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

import {
  FaBrain,
  FaPaperPlane,
  FaTrash,
  FaPlusCircle,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaProjectDiagram,
  FaTrophy,
  FaLanguage,
  FaHeart,
  FaFileAlt,
  FaCode,
} from "react-icons/fa";

import { BiBook } from "react-icons/bi";

import { useForm, useFieldArray } from "react-hook-form";

import { generateResume } from "../api/ResumeService";
import Resume from "../components/Resume";

const defaultValues = {
  personalInformation: {
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    linkedin: "",
    gitHub: "",
    portfolio: "",
  },

  summary: "",

  skills: [
    {
      title: "",
      level: "",
    },
  ],

  experience: [
    {
      jobTitle: "",
      company: "",
      location: "",
      duration: "",
      responsibility: "",
    },
  ],

  education: [
    {
      degree: "",
      university: "",
      location: "",
      graduationYear: "",
    },
  ],

  certifications: [
    {
      title: "",
      issuingOrganization: "",
      year: "",
    },
  ],

  projects: [
    {
      title: "",
      description: "",
      technologiesUsed: [],
      githubLink: "",
    },
  ],

  achievements: [
    {
      title: "",
      year: "",
      extraInformation: "",
    },
  ],

  languages: [
    {
      id: 1,
      name: "",
    },
  ],

  interests: [
    {
      name: "",
    },
  ],
};

const GenerateResume = () => {
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [userDescription, setUserDescription] = useState("");

  // =========================================================
  // REACT HOOK FORM
  // =========================================================

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues,
  });

  // =========================================================
  // FIELD ARRAYS
  // =========================================================

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: "achievements",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const {
    fields: interestFields,
    append: appendInterest,
    remove: removeInterest,
  } = useFieldArray({
    control,
    name: "interests",
  });

  // =========================================================
  // NORMALIZE ARRAY
  // =========================================================

  const normalizeArray = (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  // =========================================================
  // FORMAT AI RESPONSE
  // =========================================================

  const formatResumeData = (resumeData) => {
    const personal = resumeData?.personalInformation || {};

    return {
      personalInformation: {
        fullName: personal.fullName || "",
        email: personal.email || "",
        phoneNumber: personal.phoneNumber || "",
        location: personal.location || "",

        linkedin: personal.linkedin || personal.linkedIn || "",

        gitHub: personal.gitHub || personal.github || "",

        portfolio: personal.portfolio || "",
      },

      summary:
        typeof resumeData?.summary === "string"
          ? resumeData.summary
          : "",

      skills: Array.isArray(resumeData?.skills)
        ? resumeData.skills.map((skill) => ({
            title:
              typeof skill === "string"
                ? skill
                : skill?.title || "",

            level:
              typeof skill === "object"
                ? skill?.level || ""
                : "",
          }))
        : [],

      experience: Array.isArray(resumeData?.experience)
        ? resumeData.experience.map((exp) => ({
            jobTitle: exp?.jobTitle || "",
            company: exp?.company || "",
            location: exp?.location || "",
            duration: exp?.duration || "",
            responsibility: exp?.responsibility || "",
          }))
        : [],

      education: Array.isArray(resumeData?.education)
        ? resumeData.education.map((edu) => ({
            degree: edu?.degree || "",
            university: edu?.university || "",
            location: edu?.location || "",
            graduationYear: edu?.graduationYear || "",
          }))
        : [],

      certifications: Array.isArray(resumeData?.certifications)
        ? resumeData.certifications.map((cert) => ({
            title: cert?.title || "",
            issuingOrganization:
              cert?.issuingOrganization || "",
            year: cert?.year || "",
          }))
        : [],

      projects: Array.isArray(resumeData?.projects)
        ? resumeData.projects.map((project) => ({
            title: project?.title || "",
            description: project?.description || "",

            technologiesUsed: normalizeArray(
              project?.technologiesUsed
            ),

            githubLink: project?.githubLink || "",
          }))
        : [],

      achievements: Array.isArray(resumeData?.achievements)
        ? resumeData.achievements.map((achievement) => ({
            title: achievement?.title || "",
            year: achievement?.year || "",
            extraInformation:
              achievement?.extraInformation || "",
          }))
        : [],

      languages: Array.isArray(resumeData?.languages)
        ? resumeData.languages.map((language, index) => ({
            id:
              typeof language?.id === "number"
                ? language.id
                : index + 1,

            name:
              typeof language === "string"
                ? language
                : language?.name || "",
          }))
        : [],

      interests: Array.isArray(resumeData?.interests)
        ? resumeData.interests.map((interest) => ({
            name:
              typeof interest === "string"
                ? interest
                : interest?.name || "",
          }))
        : [],
    };
  };

  // =========================================================
  // GENERATE RESUME
  // =========================================================

  const handleGenerateResume = async () => {
    if (!userDescription.trim()) {
      toast.error("Please enter your resume description.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Sending description:",
        userDescription.trim()
      );

      const response = await generateResume({
        userDescription: userDescription.trim(),
      });

      console.log("FULL BACKEND RESPONSE:", response);

      if (
        !response ||
        typeof response !== "object" ||
        Array.isArray(response)
      ) {
        throw new Error(
          "Backend returned invalid resume data."
        );
      }

      const formattedData = formatResumeData(response);

      console.log(
        "FORMATTED RESUME DATA:",
        formattedData
      );

      reset(formattedData);

      setGeneratedResume(formattedData);

      toast.success("Resume generated successfully!");
    } catch (error) {
      console.error(
        "Resume generation error:",
        error
      );

      console.error(
        "HTTP status:",
        error?.response?.status
      );

      console.error(
        "Backend response:",
        error?.response?.data
      );

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      toast.error(
        backendMessage ||
          "Failed to generate resume. Check backend console."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {
    reset(defaultValues);

    setGeneratedResume(null);

    setUserDescription("");

    toast.success("Form cleared.");
  };

  // =========================================================
  // MANUAL SUBMIT
  // =========================================================

  const onSubmit = (data) => {
    console.log("MANUAL FORM DATA:", data);

    setGeneratedResume(data);

    toast.success("Resume preview updated.");
  };

  // =========================================================
  // COMMON LIGHT INPUT CLASS
  // =========================================================

  const inputClass =
    "resume-input input w-full h-12 rounded-xl bg-white/50 border-gray-300/50 focus:border-[#D85B9B] focus:ring-[#D85B9B]/20";

  const textareaClass =
    "resume-textarea textarea w-full rounded-xl bg-white/50 border-gray-300/50 focus:border-[#D85B9B] focus:ring-[#D85B9B]/20";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0618] via-[#1a0f1f] to-[#0d0813]">
      <Navbar />

      <main className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative z-10 max-w-7xl mx-auto">

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-3">
              <div className="relative">
                <FaBrain className="text-[#F4D6A4] text-5xl drop-shadow-[0_0_30px_rgba(216,91,155,0.6)] animate-pulse" />
                <div className="absolute -inset-1 bg-[#D85B9B]/20 blur-xl rounded-full"></div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#F4D6A4] via-[#E8B4D8] to-[#D85B9B] bg-clip-text text-transparent">
                AI Resume Builder
              </h1>
            </div>

            <p className="mt-3 text-[#F3EAF4]/70 text-base sm:text-lg max-w-2xl mx-auto leading-7">
              Craft your professional IT resume with the power of artificial intelligence
            </p>
          </div>

          {/* =================================================
              AI DESCRIPTION
          ================================================= */}

          <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/30 rounded-[26px] shadow-[0_24px_70px_rgba(0,0,0,0.50)] mb-8 overflow-hidden backdrop-blur-sm">
            <div className="p-6 sm:p-8 lg:p-9 border-t-4 border-[#D85B9B]">

              <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                <FaBrain className="text-[#D85B9B] animate-pulse" />
                Describe Yourself
              </h2>

              <p className="text-[#C4B5C6] leading-7 mt-1">
                Enter your skills, education, projects, experience and career goals. AI will generate your resume.
              </p>

              <textarea
                value={userDescription}
                onChange={(e) =>
                  setUserDescription(e.target.value)
                }
                placeholder="Example: I am a Computer Science student skilled in Java, Spring Boot, React.js, JavaScript, MySQL and Tailwind CSS..."
                className={`${textareaClass} !h-56 resize-y !rounded-2xl !p-5 !text-[15px] !leading-7 mt-5 bg-[#0d0813]/50 backdrop-blur-sm text-white placeholder-gray-400 border-[#D85B9B]/20`}
              />

              <div className="flex flex-wrap gap-3 mt-4">

                <button
                  type="button"
                  onClick={handleGenerateResume}
                  disabled={loading}
                  className="btn h-12 px-6 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_8px_25px_rgba(216,91,155,0.3)] hover:shadow-[0_8px_30px_rgba(216,91,155,0.5)] transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Generate Resume
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="btn h-12 px-6 rounded-xl bg-[#1a1225] border border-[#D85B9B]/30 text-[#F4D6A4] hover:bg-[#2B1721] hover:border-[#D85B9B]/60 transition-all duration-300"
                >
                  <FaTrash />
                  Clear
                </button>

              </div>
            </div>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2 mb-5">
                  <FaUser className="text-[#D85B9B]" />
                  <span className="w-2 h-7 rounded-full bg-gradient-to-b from-[#D85B9B] to-[#F4D6A4] shadow-sm inline-block"></span>
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    {...register(
                      "personalInformation.fullName"
                    )}
                    placeholder="Full Name"
                    className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                  />

                  <input
                    {...register(
                      "personalInformation.email"
                    )}
                    placeholder="Email"
                    type="email"
                    className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                  />

                  <input
                    {...register(
                      "personalInformation.phoneNumber"
                    )}
                    placeholder="Phone Number"
                    className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                  />

                  <input
                    {...register(
                      "personalInformation.location"
                    )}
                    placeholder="Location"
                    className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                  />

                  <input
                    {...register(
                      "personalInformation.linkedin"
                    )}
                    placeholder="LinkedIn URL"
                    className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                  />

                  <input
                    {...register(
                      "personalInformation.gitHub"
                    )}
                    placeholder="GitHub URL"
                    className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                  />

                  <input
                    {...register(
                      "personalInformation.portfolio"
                    )}
                    placeholder="Portfolio URL"
                    className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                  />

                </div>
              </div>
            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2 mb-5">
                  <FaFileAlt className="text-[#D85B9B]" />
                  <span className="w-2 h-7 rounded-full bg-gradient-to-b from-[#D85B9B] to-[#F4D6A4] shadow-sm inline-block"></span>
                  Professional Summary
                </h2>

                <textarea
                  {...register("summary")}
                  placeholder="Professional Summary"
                  className={`${textareaClass} !min-h-36 !p-4 text-white placeholder-gray-400 bg-[#0d0813]/40`}
                />

              </div>
            </div>

            {/* =================================================
                SKILLS
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaCode className="text-[#D85B9B]" />
                    Skills
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendSkill({
                        title: "",
                        level: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Skill
                  </button>

                </div>

                {skillFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid md:grid-cols-3 gap-3 mt-4"
                  >

                    <input
                      {...register(
                        `skills.${index}.title`
                      )}
                      placeholder="Skill"
                      className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <input
                      {...register(
                        `skills.${index}.level`
                      )}
                      placeholder="Level"
                      className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(index)
                      }
                      className="btn h-11 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                    >
                      <FaTrash />
                      Remove
                    </button>

                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                EXPERIENCE
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaBriefcase className="text-[#D85B9B]" />
                    Experience
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendExperience({
                        jobTitle: "",
                        company: "",
                        location: "",
                        duration: "",
                        responsibility: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Experience
                  </button>

                </div>

                {experienceFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-[#D85B9B]/20 bg-[#0d0813]/30 backdrop-blur-sm rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                  >

                    <input
                      {...register(
                        `experience.${index}.jobTitle`
                      )}
                      placeholder="Job Title"
                      className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <div className="grid md:grid-cols-2 gap-3">

                      <input
                        {...register(
                          `experience.${index}.company`
                        )}
                        placeholder="Company"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <input
                        {...register(
                          `experience.${index}.location`
                        )}
                        placeholder="Location"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <input
                        {...register(
                          `experience.${index}.duration`
                        )}
                        placeholder="Duration"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                    </div>

                    <textarea
                      {...register(
                        `experience.${index}.responsibility`
                      )}
                      placeholder="Responsibilities"
                      className={`${textareaClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExperience(index)
                      }
                      className="btn btn-sm h-10 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                    >
                      <FaTrash />
                      Remove Experience
                    </button>

                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                EDUCATION
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaGraduationCap className="text-[#D85B9B]" />
                    Education
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendEducation({
                        degree: "",
                        university: "",
                        location: "",
                        graduationYear: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Education
                  </button>

                </div>

                {educationFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-[#D85B9B]/20 bg-[#0d0813]/30 backdrop-blur-sm rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                  >

                    <input
                      {...register(
                        `education.${index}.degree`
                      )}
                      placeholder="Degree"
                      className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <div className="grid md:grid-cols-3 gap-3">

                      <input
                        {...register(
                          `education.${index}.university`
                        )}
                        placeholder="University"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <input
                        {...register(
                          `education.${index}.location`
                        )}
                        placeholder="Location"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <input
                        {...register(
                          `education.${index}.graduationYear`
                        )}
                        placeholder="Graduation Year"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeEducation(index)
                      }
                      className="btn btn-sm h-10 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                    >
                      <FaTrash />
                      Remove Education
                    </button>

                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                CERTIFICATIONS
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaCertificate className="text-[#D85B9B]" />
                    Certifications
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendCertification({
                        title: "",
                        issuingOrganization: "",
                        year: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Certification
                  </button>

                </div>

                {certificationFields.map(
                  (field, index) => (
                    <div
                      key={field.id}
                      className="grid md:grid-cols-4 gap-3 mt-4"
                    >

                      <input
                        {...register(
                          `certifications.${index}.title`
                        )}
                        placeholder="Certification"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <input
                        {...register(
                          `certifications.${index}.issuingOrganization`
                        )}
                        placeholder="Issuing Organization"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <input
                        {...register(
                          `certifications.${index}.year`
                        )}
                        placeholder="Year"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeCertification(index)
                        }
                        className="btn h-11 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  )
                )}

              </div>
            </div>

            {/* =================================================
                PROJECTS
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaProjectDiagram className="text-[#D85B9B]" />
                    Projects
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendProject({
                        title: "",
                        description: "",
                        technologiesUsed: [],
                        githubLink: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Project
                  </button>

                </div>

                {projectFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-[#D85B9B]/20 bg-[#0d0813]/30 backdrop-blur-sm rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                  >

                    <input
                      {...register(
                        `projects.${index}.title`
                      )}
                      placeholder="Project Title"
                      className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <textarea
                      {...register(
                        `projects.${index}.description`
                      )}
                      placeholder="Project Description"
                      className={`${textareaClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <input
                      {...register(
                        `projects.${index}.technologiesUsed`
                      )}
                      placeholder="Technologies (Java, Spring Boot, React...)"
                      className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <input
                      {...register(
                        `projects.${index}.githubLink`
                      )}
                      placeholder="GitHub Link"
                      className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeProject(index)
                      }
                      className="btn btn-sm h-10 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                    >
                      <FaTrash />
                      Remove Project
                    </button>

                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                ACHIEVEMENTS
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaTrophy className="text-[#D85B9B]" />
                    Achievements
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendAchievement({
                        title: "",
                        year: "",
                        extraInformation: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Achievement
                  </button>

                </div>

                {achievementFields.map(
                  (field, index) => (
                    <div
                      key={field.id}
                      className="border border-[#D85B9B]/20 bg-[#0d0813]/30 backdrop-blur-sm rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                    >

                      <input
                        {...register(
                          `achievements.${index}.title`
                        )}
                        placeholder="Achievement Title"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <input
                        {...register(
                          `achievements.${index}.year`
                        )}
                        placeholder="Year"
                        className={`${inputClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <textarea
                        {...register(
                          `achievements.${index}.extraInformation`
                        )}
                        placeholder="Additional Information"
                        className={`${textareaClass} text-white placeholder-gray-400 bg-[#0d0813]/40`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeAchievement(index)
                        }
                        className="btn btn-sm h-10 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                      >
                        <FaTrash />
                        Remove Achievement
                      </button>

                    </div>
                  )
                )}

              </div>
            </div>

            {/* =================================================
                LANGUAGES
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaLanguage className="text-[#D85B9B]" />
                    Languages
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendLanguage({
                        id:
                          languageFields.length + 1,
                        name: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Language
                  </button>

                </div>

                {languageFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-3 mt-4"
                  >

                    <input
                      {...register(
                        `languages.${index}.name`
                      )}
                      placeholder="Language"
                      className={`${inputClass} flex-1 text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeLanguage(index)
                      }
                      className="btn h-11 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                    >
                      <FaTrash />
                    </button>

                  </div>
                ))}

              </div>
            </div>

            {/* =================================================
                INTERESTS
            ================================================= */}

            <div className="bg-gradient-to-br from-[#1a1225] via-[#24182B] to-[#1a0f1f] border border-[#D85B9B]/20 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.40)] overflow-hidden backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4D6A4] flex items-center gap-2">
                    <FaHeart className="text-[#D85B9B]" />
                    Interests
                  </h2>

                  <button
                    type="button"
                    className="btn btn-sm h-10 px-4 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_4px_15px_rgba(216,91,155,0.3)] transition-all duration-300"
                    onClick={() =>
                      appendInterest({
                        name: "",
                      })
                    }
                  >
                    <FaPlusCircle />
                    Add Interest
                  </button>

                </div>

                {interestFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-3 mt-4"
                  >

                    <input
                      {...register(
                        `interests.${index}.name`
                      )}
                      placeholder="Interest"
                      className={`${inputClass} flex-1 text-white placeholder-gray-400 bg-[#0d0813]/40`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeInterest(index)
                      }
                      className="btn h-11 rounded-xl bg-[#1a1225] hover:bg-[#2B1721] text-[#F4D6A4] border border-[#D85B9B]/30 hover:border-[#D85B9B]/60 transition-all duration-300"
                    >
                      <FaTrash />
                    </button>

                  </div>
                ))}

              </div>
            </div>

            {/* =================================================
                SAVE / UPDATE
            ================================================= */}

            <div className="flex justify-center pb-12 pt-4">

              <button
                type="submit"
                className="btn h-12 px-8 rounded-xl bg-gradient-to-r from-[#D85B9B] to-[#BE477F] hover:from-[#BE477F] hover:to-[#A33D6E] text-white border-0 shadow-[0_8px_25px_rgba(216,91,155,0.3)] hover:shadow-[0_8px_30px_rgba(216,91,155,0.5)] transition-all duration-300 text-lg font-semibold"
              >
                Save / Update Resume
              </button>

            </div>

          </form>

          {/* =================================================
              PREVIEW
          ================================================= */}

          {generatedResume && (
            <div className="mt-14">

              <div className="divider text-xl font-extrabold text-[#F4D6A4] my-10">
                <span className="bg-gradient-to-r from-[#D85B9B] to-[#F4D6A4] bg-clip-text text-transparent">
                  Resume Preview
                </span>
              </div>

              <Resume data={generatedResume} />

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default GenerateResume;