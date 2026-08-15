import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";

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
  FaDownload,
} from "react-icons/fa";

import { useForm, useFieldArray } from "react-hook-form";

import { generateResume } from "../api/ResumeService";
import Resume from "../components/Resume";

// =========================================================
// DEFAULT VALUES
// =========================================================

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

// =========================================================
// COMPONENT
// =========================================================

const GenerateResume = () => {
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [userDescription, setUserDescription] = useState("");

  const resumeRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

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
  // FORMAT AI RESPONSE
  // =========================================================

  const formatResumeData = (data) => {
    return {
      personalInformation: {
        fullName: data?.personalInformation?.fullName || "",
        email: data?.personalInformation?.email || "",
        phoneNumber: data?.personalInformation?.phoneNumber || "",
        location: data?.personalInformation?.location || "",
        linkedin: data?.personalInformation?.linkedin || "",
        gitHub: data?.personalInformation?.gitHub || "",
        portfolio: data?.personalInformation?.portfolio || "",
      },

      summary: data?.summary || "",

      skills: Array.isArray(data?.skills)
        ? data.skills.map((skill) => ({
            title:
              typeof skill === "string"
                ? skill
                : skill?.title || skill?.name || "",

            level:
              typeof skill === "object"
                ? skill?.level || ""
                : "",
          }))
        : [],

      experience: Array.isArray(data?.experience)
        ? data.experience.map((experience) => ({
            jobTitle: experience?.jobTitle || "",
            company: experience?.company || "",
            location: experience?.location || "",
            duration: experience?.duration || "",
            responsibility: experience?.responsibility || "",
          }))
        : [],

      education: Array.isArray(data?.education)
        ? data.education.map((education) => ({
            degree: education?.degree || "",
            university: education?.university || "",
            location: education?.location || "",
            graduationYear: education?.graduationYear || "",
          }))
        : [],

      certifications: Array.isArray(data?.certifications)
        ? data.certifications.map((certification) => ({
            title:
              certification?.title ||
              certification?.name ||
              "",

            issuingOrganization:
              certification?.issuingOrganization ||
              certification?.issuer ||
              "",

            year: certification?.year || "",
          }))
        : [],

      projects: Array.isArray(data?.projects)
        ? data.projects.map((project) => ({
            title: project?.title || "",

            description: project?.description || "",

            technologiesUsed: Array.isArray(
              project?.technologiesUsed
            )
              ? project.technologiesUsed
              : typeof project?.technologiesUsed === "string"
              ? project.technologiesUsed
                  .split(",")
                  .map((technology) => technology.trim())
                  .filter(Boolean)
              : [],

            githubLink: project?.githubLink || "",
          }))
        : [],

      achievements: Array.isArray(data?.achievements)
        ? data.achievements.map((achievement) => ({
            title:
              achievement?.title ||
              achievement?.name ||
              "",

            year: achievement?.year || "",

            extraInformation:
              achievement?.extraInformation ||
              achievement?.description ||
              "",
          }))
        : [],

      languages: Array.isArray(data?.languages)
        ? data.languages.map((language, index) => ({
            id: index + 1,

            name:
              typeof language === "string"
                ? language
                : language?.name || "",
          }))
        : [],

      interests: Array.isArray(data?.interests)
        ? data.interests.map((interest) => ({
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
  // DOWNLOAD RESUME AS PDF
  // =========================================================

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      toast.error("Resume preview is not available.");
      return;
    }

    try {
      setDownloading(true);

      toast.loading("Preparing your resume...", {
        id: "resume-download",
      });

      const element = resumeRef.current;

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight
      );

      const fullName =
        generatedResume?.personalInformation?.fullName ||
        "Resume";

      const safeFileName = fullName
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

      pdf.save(
        `${safeFileName || "Resume"}_Resume.pdf`
      );

      toast.success(
        "Resume downloaded successfully!",
        {
          id: "resume-download",
        }
      );
    } catch (error) {
      console.error(
        "PDF download error:",
        error
      );

      toast.error(
        "Failed to download resume.",
        {
          id: "resume-download",
        }
      );
    } finally {
      setDownloading(false);
    }
  };

  // =========================================================
  // SIMPLE UI CLASSES
  // =========================================================

  const inputClass =
    "input w-full h-11 rounded-lg " +
    "bg-white text-gray-900 " +
    "border border-gray-300 " +
    "placeholder:text-gray-400 " +
    "focus:border-blue-500 " +
    "focus:ring-2 focus:ring-blue-100 " +
    "focus:outline-none " +
    "transition";

  const textareaClass =
    "textarea w-full rounded-lg " +
    "bg-white text-gray-900 " +
    "border border-gray-300 " +
    "placeholder:text-gray-400 " +
    "focus:border-blue-500 " +
    "focus:ring-2 focus:ring-blue-100 " +
    "focus:outline-none " +
    "transition";

  const cardClass =
    "bg-white border border-gray-200 rounded-xl " +
    "shadow-sm overflow-hidden";

  const addButtonClass =
    "btn btn-sm h-10 px-4 rounded-lg " +
    "bg-blue-600 hover:bg-blue-700 " +
    "text-white border-0 transition";

  const removeButtonClass =
    "btn h-10 rounded-lg " +
    "bg-white hover:bg-red-50 " +
    "text-red-600 border border-gray-300 " +
    "hover:border-red-300 transition";

  const sectionTitleClass =
    "text-xl font-semibold text-gray-900 flex items-center gap-2";

  const iconClass = "text-blue-600";

  const itemClass =
    "border border-gray-200 rounded-lg p-5 mt-5 space-y-3 bg-gray-50";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="px-4 sm:px-6 lg:px-8 py-10">

        <div className="max-w-6xl mx-auto">

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="text-center mb-10">

            <div className="flex justify-center items-center gap-3">

              <FaBrain className="text-blue-600 text-4xl" />

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                AI Resume Builder
              </h1>

            </div>

            <p className="mt-3 text-gray-500 text-base">
              Create a professional resume with the help of AI
            </p>

          </div>

          {/* =================================================
              AI DESCRIPTION
          ================================================= */}

          <div className={`${cardClass} mb-8`}>

            <div className="p-6 sm:p-8">

              <h2 className={sectionTitleClass}>

                <FaBrain className={iconClass} />

                Describe Yourself

              </h2>

              <p className="text-gray-500 mt-2">
                Enter your skills, education, projects,
                experience and career goals. AI will generate
                your resume.
              </p>

              <textarea
                value={userDescription}
                onChange={(e) =>
                  setUserDescription(e.target.value)
                }
                placeholder="Example: I am a Computer Science student skilled in Java, Spring Boot, React.js, JavaScript, MySQL and Tailwind CSS..."
                className={`${textareaClass} !h-48 resize-y !p-4 mt-5`}
              />

              <div className="flex flex-wrap gap-3 mt-4">

                <button
                  type="button"
                  onClick={handleGenerateResume}
                  disabled={loading}
                  className="btn h-11 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border-0"
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
                  className="btn h-11 px-5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
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
            className="space-y-6"
          >

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <h2 className={`${sectionTitleClass} mb-5`}>

                  <FaUser className={iconClass} />

                  Personal Information

                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    {...register(
                      "personalInformation.fullName"
                    )}
                    placeholder="Full Name"
                    className={inputClass}
                  />

                  <input
                    {...register(
                      "personalInformation.email"
                    )}
                    placeholder="Email"
                    type="email"
                    className={inputClass}
                  />

                  <input
                    {...register(
                      "personalInformation.phoneNumber"
                    )}
                    placeholder="Phone Number"
                    className={inputClass}
                  />

                  <input
                    {...register(
                      "personalInformation.location"
                    )}
                    placeholder="Location"
                    className={inputClass}
                  />

                  <input
                    {...register(
                      "personalInformation.linkedin"
                    )}
                    placeholder="LinkedIn URL"
                    className={inputClass}
                  />

                  <input
                    {...register(
                      "personalInformation.gitHub"
                    )}
                    placeholder="GitHub URL"
                    className={inputClass}
                  />

                  <input
                    {...register(
                      "personalInformation.portfolio"
                    )}
                    placeholder="Portfolio URL"
                    className={inputClass}
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <h2 className={`${sectionTitleClass} mb-5`}>

                  <FaFileAlt className={iconClass} />

                  Professional Summary

                </h2>

                <textarea
                  {...register("summary")}
                  placeholder="Professional Summary"
                  className={`${textareaClass} !min-h-36 !p-4`}
                />

              </div>

            </div>

            {/* =================================================
                SKILLS
            ================================================= */}

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaCode className={iconClass} />

                    Skills

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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
                      className={inputClass}
                    />

                    <input
                      {...register(
                        `skills.${index}.level`
                      )}
                      placeholder="Level"
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className={removeButtonClass}
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

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaBriefcase className={iconClass} />

                    Experience

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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
                    className={itemClass}
                  >

                    <input
                      {...register(
                        `experience.${index}.jobTitle`
                      )}
                      placeholder="Job Title"
                      className={inputClass}
                    />

                    <div className="grid md:grid-cols-2 gap-3">

                      <input
                        {...register(
                          `experience.${index}.company`
                        )}
                        placeholder="Company"
                        className={inputClass}
                      />

                      <input
                        {...register(
                          `experience.${index}.location`
                        )}
                        placeholder="Location"
                        className={inputClass}
                      />

                      <input
                        {...register(
                          `experience.${index}.duration`
                        )}
                        placeholder="Duration"
                        className={inputClass}
                      />

                    </div>

                    <textarea
                      {...register(
                        `experience.${index}.responsibility`
                      )}
                      placeholder="Responsibilities"
                      className={`${textareaClass} !min-h-28 !p-4`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExperience(index)
                      }
                      className="btn btn-sm h-10 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-gray-300 hover:border-red-300"
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

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaGraduationCap className={iconClass} />

                    Education

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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
                    className={itemClass}
                  >

                    <input
                      {...register(
                        `education.${index}.degree`
                      )}
                      placeholder="Degree"
                      className={inputClass}
                    />

                    <div className="grid md:grid-cols-3 gap-3">

                      <input
                        {...register(
                          `education.${index}.university`
                        )}
                        placeholder="University"
                        className={inputClass}
                      />

                      <input
                        {...register(
                          `education.${index}.location`
                        )}
                        placeholder="Location"
                        className={inputClass}
                      />

                      <input
                        {...register(
                          `education.${index}.graduationYear`
                        )}
                        placeholder="Graduation Year"
                        className={inputClass}
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeEducation(index)
                      }
                      className="btn btn-sm h-10 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-gray-300 hover:border-red-300"
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

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaCertificate className={iconClass} />

                    Certifications

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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

                {certificationFields.map((field, index) => (

                  <div
                    key={field.id}
                    className="grid md:grid-cols-4 gap-3 mt-4"
                  >

                    <input
                      {...register(
                        `certifications.${index}.title`
                      )}
                      placeholder="Certification"
                      className={inputClass}
                    />

                    <input
                      {...register(
                        `certifications.${index}.issuingOrganization`
                      )}
                      placeholder="Issuing Organization"
                      className={inputClass}
                    />

                    <input
                      {...register(
                        `certifications.${index}.year`
                      )}
                      placeholder="Year"
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeCertification(index)
                      }
                      className={removeButtonClass}
                    >

                      <FaTrash />

                      Remove

                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* =================================================
                PROJECTS
            ================================================= */}

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaProjectDiagram className={iconClass} />

                    Projects

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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
                    className={itemClass}
                  >

                    <input
                      {...register(
                        `projects.${index}.title`
                      )}
                      placeholder="Project Title"
                      className={inputClass}
                    />

                    <textarea
                      {...register(
                        `projects.${index}.description`
                      )}
                      placeholder="Project Description"
                      className={`${textareaClass} !min-h-28 !p-4`}
                    />

                    <input
                      {...register(
                        `projects.${index}.technologiesUsed`
                      )}
                      placeholder="Technologies (Java, Spring Boot, React...)"
                      className={inputClass}
                    />

                    <input
                      {...register(
                        `projects.${index}.githubLink`
                      )}
                      placeholder="GitHub Link"
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="btn btn-sm h-10 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-gray-300 hover:border-red-300"
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

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaTrophy className={iconClass} />

                    Achievements

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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

                {achievementFields.map((field, index) => (

                  <div
                    key={field.id}
                    className={itemClass}
                  >

                    <input
                      {...register(
                        `achievements.${index}.title`
                      )}
                      placeholder="Achievement Title"
                      className={inputClass}
                    />

                    <input
                      {...register(
                        `achievements.${index}.year`
                      )}
                      placeholder="Year"
                      className={inputClass}
                    />

                    <textarea
                      {...register(
                        `achievements.${index}.extraInformation`
                      )}
                      placeholder="Additional Information"
                      className={`${textareaClass} !min-h-28 !p-4`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeAchievement(index)
                      }
                      className="btn btn-sm h-10 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-gray-300 hover:border-red-300"
                    >

                      <FaTrash />

                      Remove Achievement

                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* =================================================
                LANGUAGES
            ================================================= */}

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaLanguage className={iconClass} />

                    Languages

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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
                      className={`${inputClass} flex-1`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeLanguage(index)
                      }
                      className={removeButtonClass}
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

            <div className={cardClass}>

              <div className="p-6 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  <h2 className={sectionTitleClass}>

                    <FaHeart className={iconClass} />

                    Interests

                  </h2>

                  <button
                    type="button"
                    className={addButtonClass}
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
                      className={`${inputClass} flex-1`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeInterest(index)
                      }
                      className={removeButtonClass}
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

            <div className="flex justify-center py-6">

              <button
                type="submit"
                className="btn h-11 px-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium"
              >

                Save / Update Resume

              </button>

            </div>

          </form>

          {/* =================================================
              RESUME PREVIEW
          ================================================= */}

          {generatedResume && (

            <div className="mt-10">

              {/* PREVIEW TITLE */}

              <div className="border-b border-gray-200 pb-3 mb-8">

                <h2 className="text-2xl font-semibold text-gray-900 text-center">
                  Resume Preview
                </h2>

              </div>

              {/* DOWNLOAD BUTTON */}

              <div className="flex justify-center mb-8">

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="
                    btn
                    h-11
                    px-6
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    border-0
                    font-medium
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >

                  {downloading ? (

                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Preparing PDF...
                    </>

                  ) : (

                    <>
                      <FaDownload />
                      Download Resume
                    </>

                  )}

                </button>

              </div>

              {/* RESUME */}

              <div className="flex justify-center overflow-x-auto">

                <div
                  ref={resumeRef}
                  className="bg-white"
                >

                  <Resume data={generatedResume} />

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default GenerateResume;
