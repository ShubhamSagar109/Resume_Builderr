import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
  FaBrain,
  FaPaperPlane,
  FaTrash,
  FaPlusCircle,
} from "react-icons/fa";

import { BiBook } from "react-icons/bi";

import {
  useForm,
  useFieldArray,
} from "react-hook-form";

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
  const [generatedResume, setGeneratedResume] =
    useState(null);

  const [userDescription, setUserDescription] =
    useState("");

  // =========================================================
  // REACT HOOK FORM
  // =========================================================

  const {
    register,
    control,
    handleSubmit,
    reset,
  } = useForm({
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

    if (typeof value === "string" &&
        value.trim()) {

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

    const personal =
      resumeData?.personalInformation || {};

    return {

      personalInformation: {
        fullName: personal.fullName || "",
        email: personal.email || "",
        phoneNumber: personal.phoneNumber || "",
        location: personal.location || "",

        linkedin:
          personal.linkedin ||
          personal.linkedIn ||
          "",

        gitHub:
          personal.gitHub ||
          personal.github ||
          "",

        portfolio:
          personal.portfolio || "",
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

      experience:
        Array.isArray(resumeData?.experience)
          ? resumeData.experience.map((exp) => ({
              jobTitle:
                exp?.jobTitle || "",

              company:
                exp?.company || "",

              location:
                exp?.location || "",

              duration:
                exp?.duration || "",

              responsibility:
                exp?.responsibility || "",
            }))
          : [],

      education:
        Array.isArray(resumeData?.education)
          ? resumeData.education.map((edu) => ({
              degree:
                edu?.degree || "",

              university:
                edu?.university || "",

              location:
                edu?.location || "",

              graduationYear:
                edu?.graduationYear || "",
            }))
          : [],

      certifications:
        Array.isArray(resumeData?.certifications)
          ? resumeData.certifications.map(
              (cert) => ({
                title:
                  cert?.title || "",

                issuingOrganization:
                  cert?.issuingOrganization || "",

                year:
                  cert?.year || "",
              })
            )
          : [],

      projects:
        Array.isArray(resumeData?.projects)
          ? resumeData.projects.map(
              (project) => ({
                title:
                  project?.title || "",

                description:
                  project?.description || "",

                technologiesUsed:
                  normalizeArray(
                    project?.technologiesUsed
                  ),

                githubLink:
                  project?.githubLink || "",
              })
            )
          : [],

      achievements:
        Array.isArray(resumeData?.achievements)
          ? resumeData.achievements.map(
              (achievement) => ({
                title:
                  achievement?.title || "",

                year:
                  achievement?.year || "",

                extraInformation:
                  achievement?.extraInformation ||
                  "",
              })
            )
          : [],

      languages:
        Array.isArray(resumeData?.languages)
          ? resumeData.languages.map(
              (language, index) => ({
                id:
                  typeof language?.id === "number"
                    ? language.id
                    : index + 1,

                name:
                  typeof language === "string"
                    ? language
                    : language?.name || "",
              })
            )
          : [],

      interests:
        Array.isArray(resumeData?.interests)
          ? resumeData.interests.map(
              (interest) => ({
                name:
                  typeof interest === "string"
                    ? interest
                    : interest?.name || "",
              })
            )
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
      userDescription
    );

    const response = await generateResume(
      userDescription.trim()
    );

    console.log(
      "FULL BACKEND RESPONSE:",
      response
    );

    if (
      !response ||
      typeof response !== "object" ||
      Array.isArray(response)
    ) {
      throw new Error(
        "Backend returned invalid resume data."
      );
    }

    const formattedData =
      formatResumeData(response);

    console.log(
      "FORMATTED RESUME DATA:",
      formattedData
    );

    reset(formattedData);

    setGeneratedResume(formattedData);

    toast.success(
      "Resume generated successfully!"
    );
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
      error?.response?.data?.error;

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

    console.log(
      "MANUAL FORM DATA:",
      data
    );

    setGeneratedResume(data);

    toast.success(
      "Resume preview updated."
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    
    <div className="relative isolate min-h-screen overflow-hidden bg-[#111214] text-[#211A36] px-4 py-8 sm:px-6 lg:px-8">
     
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Navbar/>
        <div className="absolute left-[12%] top-[-10%] h-[560px] w-[240px] rotate-[10deg] rounded-full bg-[#6D3F82]/55 blur-[95px]"></div>
        <div className="absolute left-[34%] top-[-5%] h-[620px] w-[210px] rounded-full bg-[#A83E91]/50 blur-[105px]"></div>
        <div className="absolute left-[55%] top-[5%] h-[650px] w-[230px] -rotate-[5deg] rounded-full bg-[#D05B91]/45 blur-[110px]"></div>
        <div className="absolute left-[22%] bottom-[-18%] h-[430px] w-[280px] rotate-[28deg] rounded-full bg-[#FF8A5B]/55 blur-[75px]"></div>
        <div className="absolute right-[-8%] top-[18%] h-[420px] w-[260px] rounded-full bg-[#522D63]/45 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.05),transparent_42%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        

        {/* PAGE TITLE */}

        <div className="text-center mb-12">

          <div className="flex justify-center items-center gap-3 mb-3">

            <FaBrain
              className="text-[#F4D6A4] text-4xl drop-shadow-[0_0_18px_rgba(216,91,155,0.55)]"
            />

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.35)]">
              AI Resume Builder
            </h1>

          </div>

          <p className="mt-3 text-[#F3EAF4]/85 text-base sm:text-lg max-w-2xl mx-auto leading-7">
            Generate a professional IT resume
            using AI.
          </p>

        </div>

        {/* AI DESCRIPTION */}

        <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_24px_70px_rgba(0,0,0,0.30)] mb-8 overflow-hidden">

          <div className="p-6 sm:p-8 lg:p-9 border-t-4 border-[#D85B9B]">

            <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">

              <FaBrain className="text-[#D85B9B]" />

              Describe Yourself

            </h2>

            <p className="text-[#6F6682] leading-7">
              Enter your skills, education,
              projects, experience and career
              goals. AI will generate your resume.
            </p>

            <textarea
              value={userDescription}
              onChange={(e) =>
                setUserDescription(e.target.value)
              }
              placeholder="Example: I am a Computer Science student skilled in Java, Spring Boot, React.js, JavaScript, MySQL and Tailwind CSS..."
              className="textarea w-full h-52 mt-5 bg-white border border-[#D8D3DD] rounded-2xl text-[#211A36] placeholder:text-[#A59AAA] leading-7 p-5 focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
            />

            <div className="flex flex-wrap gap-3 mt-4">

              <button
                type="button"
                onClick={handleGenerateResume}
                disabled={loading}
                className="btn h-12 px-6 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-[0_8px_20px_rgba(33,26,54,0.18)]"
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
                className="btn h-12 px-6 rounded-xl bg-white border border-[#E9B5D0] text-[#C34C89] hover:bg-[#FFF1F8] hover:border-[#D98AAF]"
              >
                <FaTrash />
                Clear
              </button>

            </div>

          </div>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >

          {/* PERSONAL INFORMATION */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                <span className="w-2 h-7 rounded-full bg-[#211A36] shadow-sm inline-block"></span>
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  {...register(
                    "personalInformation.fullName"
                  )}
                  placeholder="Full Name"
                  className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                />

                <input
                  {...register(
                    "personalInformation.email"
                  )}
                  placeholder="Email"
                  type="email"
                  className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                />

                <input
                  {...register(
                    "personalInformation.phoneNumber"
                  )}
                  placeholder="Phone Number"
                  className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                />

                <input
                  {...register(
                    "personalInformation.location"
                  )}
                  placeholder="Location"
                  className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                />

                <input
                  {...register(
                    "personalInformation.linkedin"
                  )}
                  placeholder="LinkedIn URL"
                  className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                />

                <input
                  {...register(
                    "personalInformation.gitHub"
                  )}
                  placeholder="GitHub URL"
                  className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                />

                <input
                  {...register(
                    "personalInformation.portfolio"
                  )}
                  placeholder="Portfolio URL"
                  className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                />

              </div>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                <span className="w-2 h-7 rounded-full bg-[#211A36] shadow-sm inline-block"></span>
                Professional Summary
              </h2>

              <textarea
                {...register("summary")}
                placeholder="Professional Summary"
                className="textarea w-full min-h-32 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
              />

            </div>

          </div>

          {/* SKILLS */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  Skills
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#D85B9B] hover:bg-[#BE477F] text-white border-0 shadow-[0_8px_20px_rgba(216,91,155,0.25)]"
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

              {skillFields.map(
                (field, index) => (

                  <div
                    key={field.id}
                    className="grid md:grid-cols-3 gap-3 mt-4"
                  >

                    <input
                      {...register(
                        `skills.${index}.title`
                      )}
                      placeholder="Skill"
                      className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <input
                      {...register(
                        `skills.${index}.level`
                      )}
                      placeholder="Level"
                      className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(index)
                      }
                      className="btn h-11 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* EXPERIENCE */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  Experience
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-sm"
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

              {experienceFields.map(
                (field, index) => (

                  <div
                    key={field.id}
                    className="border border-[#D8D3DD] bg-[#F8FFFC] rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                  >

                    <input
                      {...register(
                        `experience.${index}.jobTitle`
                      )}
                      placeholder="Job Title"
                      className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <div className="grid md:grid-cols-2 gap-3">

                      <input
                        {...register(
                          `experience.${index}.company`
                        )}
                        placeholder="Company"
                        className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                      />

                      <input
                        {...register(
                          `experience.${index}.location`
                        )}
                        placeholder="Location"
                        className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                      />

                      <input
                        {...register(
                          `experience.${index}.duration`
                        )}
                        placeholder="Duration"
                        className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                      />

                    </div>

                    <textarea
                      {...register(
                        `experience.${index}.responsibility`
                      )}
                      placeholder="Responsibilities"
                      className="textarea w-full bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExperience(index)
                      }
                      className="btn btn-sm h-10 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                      Remove Experience
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* EDUCATION */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  <BiBook />
                  Education
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-sm"
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

              {educationFields.map(
                (field, index) => (

                  <div
                    key={field.id}
                    className="border border-[#D8D3DD] bg-[#F8FFFC] rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                  >

                    <input
                      {...register(
                        `education.${index}.degree`
                      )}
                      placeholder="Degree"
                      className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <div className="grid md:grid-cols-3 gap-3">

                      <input
                        {...register(
                          `education.${index}.university`
                        )}
                        placeholder="University"
                        className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                      />

                      <input
                        {...register(
                          `education.${index}.location`
                        )}
                        placeholder="Location"
                        className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                      />

                      <input
                        {...register(
                          `education.${index}.graduationYear`
                        )}
                        placeholder="Graduation Year"
                        className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeEducation(index)
                      }
                      className="btn btn-sm h-10 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                      Remove Education
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* CERTIFICATIONS */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  Certifications
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-sm"
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
                      className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <input
                      {...register(
                        `certifications.${index}.issuingOrganization`
                      )}
                      placeholder="Issuing Organization"
                      className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <input
                      {...register(
                        `certifications.${index}.year`
                      )}
                      placeholder="Year"
                      className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeCertification(index)
                      }
                      className="btn h-11 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* PROJECTS */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  Projects
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-sm"
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

              {projectFields.map(
                (field, index) => (

                  <div
                    key={field.id}
                    className="border border-[#D8D3DD] bg-[#F8FFFC] rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                  >

                    <input
                      {...register(
                        `projects.${index}.title`
                      )}
                      placeholder="Project Title"
                      className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <textarea
                      {...register(
                        `projects.${index}.description`
                      )}
                      placeholder="Project Description"
                      className="textarea w-full bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <input
                      {...register(
                        `projects.${index}.technologiesUsed`
                      )}
                      placeholder="Technologies (Java, Spring Boot, React...)"
                      className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <input
                      {...register(
                        `projects.${index}.githubLink`
                      )}
                      placeholder="GitHub Link"
                      className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeProject(index)
                      }
                      className="btn btn-sm h-10 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                      Remove Project
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* ACHIEVEMENTS */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  Achievements
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-sm"
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
                    className="border border-[#D8D3DD] bg-[#F8FFFC] rounded-2xl p-5 mt-5 space-y-3 shadow-sm"
                  >

                    <input
                      {...register(
                        `achievements.${index}.title`
                      )}
                      placeholder="Achievement Title"
                      className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <input
                      {...register(
                        `achievements.${index}.year`
                      )}
                      placeholder="Year"
                      className="input w-full h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <textarea
                      {...register(
                        `achievements.${index}.extraInformation`
                      )}
                      placeholder="Additional Information"
                      className="textarea w-full bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeAchievement(index)
                      }
                      className="btn btn-sm h-10 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                      Remove Achievement
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* LANGUAGES */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  Languages
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-sm"
                  onClick={() =>
                    appendLanguage({
                      id: languageFields.length + 1,
                      name: "",
                    })
                  }
                >
                  <FaPlusCircle />
                  Add Language
                </button>

              </div>

              {languageFields.map(
                (field, index) => (

                  <div
                    key={field.id}
                    className="flex gap-3 mt-4"
                  >

                    <input
                      {...register(
                        `languages.${index}.name`
                      )}
                      placeholder="Language"
                      className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] flex-1 focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeLanguage(index)
                      }
                      className="btn h-11 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* INTERESTS */}

          <div className="bg-white border border-white/80 rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-hidden">

            <div className="p-6 sm:p-8 lg:p-9">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                <h2 className="text-xl sm:text-2xl font-bold text-[#211A36] flex items-center gap-2">
                  Interests
                </h2>

                <button
                  type="button"
                  className="btn btn-sm h-10 px-4 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-sm"
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

              {interestFields.map(
                (field, index) => (

                  <div
                    key={field.id}
                    className="flex gap-3 mt-4"
                  >

                    <input
                      {...register(
                        `interests.${index}.name`
                      )}
                      placeholder="Interest"
                      className="input h-12 bg-white border border-[#D8D3DD] rounded-xl text-[#211A36] placeholder:text-[#A59AAA] flex-1 focus:bg-white focus:border-[#D85B9B] focus:outline-none focus:ring-4 focus:ring-[#D85B9B]/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeInterest(index)
                      }
                      className="btn h-11 rounded-xl bg-white hover:bg-[#FFF1F8] text-[#C34C89] border border-[#E9B5D0] shadow-none"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* SAVE */}

          <div className="flex justify-center pb-12 pt-4">

            <button
              type="submit"
              className="btn h-12 px-8 rounded-xl bg-[#211214] hover:bg-[#2B1721] text-[#F4D6A4] border-0 shadow-[0_8px_20px_rgba(33,26,54,0.18)]"
            >
              Save / Update Resume
            </button>

          </div>

        </form>

        {/* PREVIEW */}

        {generatedResume && (

          <div className="mt-14">

            <div className="divider text-xl font-extrabold text-[#211A36] my-10">
              Resume Preview
            </div>

            <Resume
              data={generatedResume}
            />

          </div>

        )}

      </div>

    </div>
  );
};

export default GenerateResume;