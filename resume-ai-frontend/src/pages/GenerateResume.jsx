import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaBrain,
  FaTrash,
  FaPaperPlane,
  FaPlusCircle,
} from "react-icons/fa";
import { BiBook } from "react-icons/bi";
import { useForm, useFieldArray } from "react-hook-form";

import { generateResume } from "../api/ResumeService";
import Resume from "../components/Resume";

const initialData = {
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
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  achievements: [],
  languages: [],
  interests: [],
};

const GenerateResume = () => {
  const [data, setData] = useState(initialData);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [showFormUI, setShowFormUI] = useState(false);
  const [showResumeUI, setShowResumeUI] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: initialData,
  });

  /* ================= FIELD ARRAYS ================= */

  const skillsFields = useFieldArray({
    control,
    name: "skills",
  });

  const experienceFields = useFieldArray({
    control,
    name: "experience",
  });

  const educationFields = useFieldArray({
    control,
    name: "education",
  });

  const certificationsFields = useFieldArray({
    control,
    name: "certifications",
  });

  const projectsFields = useFieldArray({
    control,
    name: "projects",
  });

  const achievementsFields = useFieldArray({
    control,
    name: "achievements",
  });

  const languagesFields = useFieldArray({
    control,
    name: "languages",
  });

  const interestsFields = useFieldArray({
    control,
    name: "interests",
  });

  /* ================= FORM SUBMIT ================= */

  const onSubmit = (formData) => {
    console.log("FORM DATA:", formData);

    const finalData = {
      ...formData,

      // Make sure technologiesUsed becomes an array
      projects: (formData.projects || []).map((project) => ({
        ...project,
        technologiesUsed:
          typeof project.technologiesUsed === "string"
            ? project.technologiesUsed
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : project.technologiesUsed || [],
      })),

      // Ensure IDs exist
      languages: (formData.languages || []).map((language, index) => ({
        id: Number(language.id) || index + 1,
        name: language.name || "",
      })),

      interests: (formData.interests || []).map((interest, index) => ({
        id: Number(interest.id) || index + 1,
        name: interest.name || "",
      })),
    };

    console.log("FINAL RESUME DATA:", finalData);

    setData(finalData);

    setShowFormUI(false);
    setShowPromptInput(false);
    setShowResumeUI(true);
  };

  /* ================= GENERATE ================= */

  const handleGenerate = async () => {
  if (!description.trim()) {
    toast.error("Please enter your description first.");
    return;
  }

  try {
    setLoading(true);

    console.log("Sending description to backend...");

    const startTime = performance.now();

    const response = await generateResume(description.trim());

    const endTime = performance.now();

    console.log(
      `Resume generation took ${((endTime - startTime) / 1000).toFixed(2)} seconds`
    );

    console.log("FULL API RESPONSE:", response);

    // ---------------------------------------
    // Get actual resume object from response
    // ---------------------------------------

    let resumeData = response?.data ?? response;

    // Handles:
    // { data: { ...resume } }
    if (
      resumeData?.data &&
      typeof resumeData.data === "object" &&
      !Array.isArray(resumeData.data)
    ) {
      resumeData = resumeData.data;
    }

    console.log("RESUME DATA:", resumeData);

    if (
      !resumeData ||
      typeof resumeData !== "object" ||
      Array.isArray(resumeData)
    ) {
      throw new Error("Invalid resume data received from backend.");
    }

    // ---------------------------------------
    // Format resume data
    // ---------------------------------------

    const formattedData = {
      personalInformation: {
        fullName: resumeData.personalInformation?.fullName || "",
        email: resumeData.personalInformation?.email || "",
        phoneNumber: resumeData.personalInformation?.phoneNumber || "",
        location: resumeData.personalInformation?.location || "",
        linkedin: resumeData.personalInformation?.linkedin || "",
        gitHub: resumeData.personalInformation?.gitHub || "",
        portfolio: resumeData.personalInformation?.portfolio || "",
      },

      summary: resumeData.summary || "",

      skills: Array.isArray(resumeData.skills)
        ? resumeData.skills.map((skill) => ({
            title: skill?.title || "",
            level: skill?.level || "",
          }))
        : [],

      experience: Array.isArray(resumeData.experience)
        ? resumeData.experience.map((experience) => ({
            jobTitle: experience?.jobTitle || "",
            company: experience?.company || "",
            location: experience?.location || "",
            duration: experience?.duration || "",
            responsibility: experience?.responsibility || "",
          }))
        : [],

      education: Array.isArray(resumeData.education)
        ? resumeData.education.map((education) => ({
            degree: education?.degree || "",
            university: education?.university || "",
            location: education?.location || "",
            graduationYear: education?.graduationYear || "",
          }))
        : [],

      certifications: Array.isArray(resumeData.certifications)
        ? resumeData.certifications.map((certification) => ({
            title: certification?.title || "",
            issuingOrganization:
              certification?.issuingOrganization || "",
            year: certification?.year || "",
          }))
        : [],

      projects: Array.isArray(resumeData.projects)
        ? resumeData.projects.map((project) => ({
            title: project?.title || "",
            description: project?.description || "",
            technologiesUsed: Array.isArray(project?.technologiesUsed)
              ? project.technologiesUsed
              : [],
            githubLink: project?.githubLink || "",
          }))
        : [],

      achievements: Array.isArray(resumeData.achievements)
        ? resumeData.achievements.map((achievement) => ({
            title: achievement?.title || "",
            year: achievement?.year || "",
            extraInformation:
              achievement?.extraInformation || "",
          }))
        : [],

      languages: Array.isArray(resumeData.languages)
        ? resumeData.languages.map((language, index) => ({
            id: Number(language?.id) || index + 1,
            name: language?.name || "",
          }))
        : [],

      interests: Array.isArray(resumeData.interests)
        ? resumeData.interests.map((interest, index) => ({
            id: Number(interest?.id) || index + 1,
            name: interest?.name || "",
          }))
        : [],
    };

    console.log(
      "FORMATTED RESUME DATA:",
      JSON.stringify(formattedData, null, 2)
    );

    // ---------------------------------------
    // Update React state
    // ---------------------------------------

    setData(formattedData);

    // VERY IMPORTANT:
    // Update react-hook-form with generated data
    reset(formattedData);

    // ---------------------------------------
    // Change UI
    // ---------------------------------------

    toast.success("Resume Generated Successfully!");

    setShowPromptInput(false);
    setShowFormUI(true);
    setShowResumeUI(false);

  } catch (error) {
    console.error("RESUME GENERATION ERROR:", error);

    let errorMessage = "Error Generating Resume!";

    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (typeof error?.response?.data === "string") {
      errorMessage = error.response.data;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);

  } finally {
    setLoading(false);
    setDescription("");
  }
};

    
      

  /* ================= CLEAR ================= */

  const handleClear = () => {
    setDescription("");
  };

  /* ================= NORMAL INPUT ================= */

  const renderInput = (name, label, type = "text") => {
    return (
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text text-base-content">
            {label}
          </span>
        </label>

        <input
          type={type}
          {...register(name)}
          className="input input-bordered rounded-xl w-full bg-base-100 text-base-content"
        />
      </div>
    );
  };

  /* ================= FIELD ARRAY ================= */

  const renderFieldArray = (
    fields,
    label,
    name,
    keys,
    appendObject = null
  ) => {
    return (
      <div className="form-control w-full mb-6">
        <h3 className="text-xl font-semibold mb-3">
          {label}
        </h3>

        {fields.fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 rounded-lg mb-4 bg-base-100 border border-base-300"
          >
            {keys.map((key) => (
              <div key={key}>
                {renderInput(
                  `${name}.${index}.${key}`,
                  key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => fields.remove(index)}
              className="btn btn-error btn-sm mt-2"
            >
              <FaTrash className="w-4 h-4" />
              Remove {label}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            if (appendObject) {
              fields.append(appendObject);
            } else {
              const newObject = keys.reduce((acc, key) => {
                acc[key] = "";
                return acc;
              }, {});

              fields.append(newObject);
            }
          }}
          className="btn btn-secondary btn-sm flex items-center"
        >
          <FaPlusCircle className="w-5 h-5 mr-1" />
          Add {label}
        </button>
      </div>
    );
  };

  /* ================= FORM ================= */

  function showFormFunction() {
    return (
      <div className="w-full p-10">
        <h1 className="text-4xl font-bold mb-6 flex items-center justify-center gap-2">
          <BiBook className="text-accent" />
          Resume Form
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 bg-base-200 rounded-lg text-base-content"
        >
          {/* PERSONAL INFORMATION */}

          <h3 className="text-xl font-semibold">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput(
              "personalInformation.fullName",
              "Full Name"
            )}

            {renderInput(
              "personalInformation.email",
              "Email",
              "email"
            )}

            {renderInput(
              "personalInformation.phoneNumber",
              "Phone Number",
              "tel"
            )}

            {renderInput(
              "personalInformation.location",
              "Location"
            )}

            {renderInput(
              "personalInformation.linkedin",
              "LinkedIn",
              "url"
            )}

            {renderInput(
              "personalInformation.gitHub",
              "GitHub",
              "url"
            )}

            {renderInput(
              "personalInformation.portfolio",
              "Portfolio",
              "url"
            )}
          </div>

          {/* SUMMARY */}

          <h3 className="text-xl font-semibold">
            Professional Summary
          </h3>

          <textarea
            {...register("summary")}
            className="textarea textarea-bordered w-full bg-base-100 text-base-content"
            rows={4}
          />

          {/* SKILLS */}

          {renderFieldArray(
            skillsFields,
            "Skills",
            "skills",
            ["title", "level"]
          )}

          {/* EXPERIENCE */}

          {renderFieldArray(
            experienceFields,
            "Experience",
            "experience",
            [
              "jobTitle",
              "company",
              "location",
              "duration",
              "responsibility",
            ]
          )}

          {/* EDUCATION */}

          {renderFieldArray(
            educationFields,
            "Education",
            "education",
            [
              "degree",
              "university",
              "location",
              "graduationYear",
            ]
          )}

          {/* CERTIFICATIONS */}

          {renderFieldArray(
            certificationsFields,
            "Certifications",
            "certifications",
            [
              "title",
              "issuingOrganization",
              "year",
            ]
          )}

          {/* PROJECTS */}

          {renderFieldArray(
            projectsFields,
            "Projects",
            "projects",
            [
              "title",
              "description",
              "technologiesUsed",
              "githubLink",
            ]
          )}

          {/* ACHIEVEMENTS */}

          {renderFieldArray(
            achievementsFields,
            "Achievements",
            "achievements",
            [
              "title",
              "year",
              "extraInformation",
            ]
          )}

          {/* LANGUAGES */}

          {renderFieldArray(
            languagesFields,
            "Languages",
            "languages",
            ["id", "name"]
          )}

          {/* INTERESTS */}

          {renderFieldArray(
            interestsFields,
            "Interests",
            "interests",
            ["id", "name"]
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Submit & View Resume
          </button>
        </form>
      </div>
    );
  }

  /* ================= AI INPUT ================= */

  function ShowInputField() {
    return (
      <div className="bg-base-200 shadow-lg rounded-lg p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6 flex items-center justify-center gap-2">
          <FaBrain className="text-accent" />
          AI Resume Description Input
        </h1>

        <p className="mb-4 text-lg text-gray-600">
          Enter a detailed description about yourself to
          generate your professional resume.
        </p>

        <textarea
          disabled={loading}
          className="textarea textarea-bordered w-full h-48 mb-6 resize-none"
          placeholder="Example: I am Shubham, a Java Full Stak developer..."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="flex justify-center gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="btn btn-primary flex items-center gap-2"
          >
            {loading && (
              <span className="loading loading-spinner" />
            )}

            <FaPaperPlane />

            {loading
              ? "Generating..."
              : "Generate Resume"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleClear}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FaTrash />
            Clear
          </button>
        </div>
      </div>
    );
  }

  /* ================= RESUME ================= */

  function showResume() {
    return (
      <div className="w-full">
        <Resume data={data} />

        <div className="flex mt-5 justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowPromptInput(true);
              setShowFormUI(false);
              setShowResumeUI(false);
            }}
            className="btn btn-accent"
          >
            Generate Another
          </button>

          <button
            type="button"
            onClick={() => {
              setShowPromptInput(false);
              setShowFormUI(true);
              setShowResumeUI(false);

              reset(data);
            }}
            className="btn btn-success"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="mt-5 p-10 flex flex-col gap-3 items-center justify-center font-sans">
      {showFormUI && showFormFunction()}

      {showPromptInput && ShowInputField()}

      {showResumeUI && showResume()}
    </div>
  );
};

export default GenerateResume;



