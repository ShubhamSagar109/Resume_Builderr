import React, { useState } from "react";
import toast from "react-hot-toast";

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
    <div className="min-h-screen p-6">

      <div className="max-w-6xl mx-auto">

        {/* PAGE TITLE */}

        <div className="text-center mb-10">

          <div className="flex justify-center items-center gap-3">

            <FaBrain
              className="text-primary text-4xl"
            />

            <h1 className="text-4xl font-bold">
              AI Resume Builder
            </h1>

          </div>

          <p className="mt-3 text-gray-500">
            Generate a professional IT resume
            using AI.
          </p>

        </div>

        {/* AI DESCRIPTION */}

        <div className="card bg-base-100 shadow-xl mb-8">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              <FaBrain className="text-primary" />

              Describe Yourself

            </h2>

            <p className="text-gray-500">
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
              className="textarea textarea-bordered w-full h-48 mt-4"
            />

            <div className="flex flex-wrap gap-3 mt-4">

              <button
                type="button"
                onClick={handleGenerateResume}
                disabled={loading}
                className="btn btn-primary"
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
                className="btn btn-outline btn-error"
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

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  {...register(
                    "personalInformation.fullName"
                  )}
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(
                    "personalInformation.email"
                  )}
                  placeholder="Email"
                  type="email"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(
                    "personalInformation.phoneNumber"
                  )}
                  placeholder="Phone Number"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(
                    "personalInformation.location"
                  )}
                  placeholder="Location"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(
                    "personalInformation.linkedin"
                  )}
                  placeholder="LinkedIn URL"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(
                    "personalInformation.gitHub"
                  )}
                  placeholder="GitHub URL"
                  className="input input-bordered w-full"
                />

                <input
                  {...register(
                    "personalInformation.portfolio"
                  )}
                  placeholder="Portfolio URL"
                  className="input input-bordered w-full"
                />

              </div>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">
                Professional Summary
              </h2>

              <textarea
                {...register("summary")}
                placeholder="Professional Summary"
                className="textarea textarea-bordered w-full h-32"
              />

            </div>

          </div>

          {/* SKILLS */}

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  Skills
                </h2>

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
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
                      className="input input-bordered"
                    />

                    <input
                      {...register(
                        `skills.${index}.level`
                      )}
                      placeholder="Level"
                      className="input input-bordered"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(index)
                      }
                      className="btn btn-error"
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

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  Experience
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                    className="border border-base-300 rounded-lg p-4 mt-4 space-y-3"
                  >

                    <input
                      {...register(
                        `experience.${index}.jobTitle`
                      )}
                      placeholder="Job Title"
                      className="input input-bordered w-full"
                    />

                    <div className="grid md:grid-cols-2 gap-3">

                      <input
                        {...register(
                          `experience.${index}.company`
                        )}
                        placeholder="Company"
                        className="input input-bordered"
                      />

                      <input
                        {...register(
                          `experience.${index}.location`
                        )}
                        placeholder="Location"
                        className="input input-bordered"
                      />

                      <input
                        {...register(
                          `experience.${index}.duration`
                        )}
                        placeholder="Duration"
                        className="input input-bordered"
                      />

                    </div>

                    <textarea
                      {...register(
                        `experience.${index}.responsibility`
                      )}
                      placeholder="Responsibilities"
                      className="textarea textarea-bordered w-full"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExperience(index)
                      }
                      className="btn btn-error btn-sm"
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

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  <BiBook />
                  Education
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                    className="border border-base-300 rounded-lg p-4 mt-4 space-y-3"
                  >

                    <input
                      {...register(
                        `education.${index}.degree`
                      )}
                      placeholder="Degree"
                      className="input input-bordered w-full"
                    />

                    <div className="grid md:grid-cols-3 gap-3">

                      <input
                        {...register(
                          `education.${index}.university`
                        )}
                        placeholder="University"
                        className="input input-bordered"
                      />

                      <input
                        {...register(
                          `education.${index}.location`
                        )}
                        placeholder="Location"
                        className="input input-bordered"
                      />

                      <input
                        {...register(
                          `education.${index}.graduationYear`
                        )}
                        placeholder="Graduation Year"
                        className="input input-bordered"
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeEducation(index)
                      }
                      className="btn btn-error btn-sm"
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

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  Certifications
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                      className="input input-bordered"
                    />

                    <input
                      {...register(
                        `certifications.${index}.issuingOrganization`
                      )}
                      placeholder="Issuing Organization"
                      className="input input-bordered"
                    />

                    <input
                      {...register(
                        `certifications.${index}.year`
                      )}
                      placeholder="Year"
                      className="input input-bordered"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeCertification(index)
                      }
                      className="btn btn-error"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* PROJECTS */}

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  Projects
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                    className="border border-base-300 rounded-lg p-4 mt-4 space-y-3"
                  >

                    <input
                      {...register(
                        `projects.${index}.title`
                      )}
                      placeholder="Project Title"
                      className="input input-bordered w-full"
                    />

                    <textarea
                      {...register(
                        `projects.${index}.description`
                      )}
                      placeholder="Project Description"
                      className="textarea textarea-bordered w-full"
                    />

                    <input
                      {...register(
                        `projects.${index}.technologiesUsed`
                      )}
                      placeholder="Technologies (Java, Spring Boot, React...)"
                      className="input input-bordered w-full"
                    />

                    <input
                      {...register(
                        `projects.${index}.githubLink`
                      )}
                      placeholder="GitHub Link"
                      className="input input-bordered w-full"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeProject(index)
                      }
                      className="btn btn-error btn-sm"
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

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  Achievements
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                    className="border border-base-300 rounded-lg p-4 mt-4 space-y-3"
                  >

                    <input
                      {...register(
                        `achievements.${index}.title`
                      )}
                      placeholder="Achievement Title"
                      className="input input-bordered w-full"
                    />

                    <input
                      {...register(
                        `achievements.${index}.year`
                      )}
                      placeholder="Year"
                      className="input input-bordered w-full"
                    />

                    <textarea
                      {...register(
                        `achievements.${index}.extraInformation`
                      )}
                      placeholder="Additional Information"
                      className="textarea textarea-bordered w-full"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeAchievement(index)
                      }
                      className="btn btn-error btn-sm"
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

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  Languages
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                      className="input input-bordered flex-1"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeLanguage(index)
                      }
                      className="btn btn-error"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* INTERESTS */}

          <div className="card bg-base-100 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <h2 className="card-title text-2xl">
                  Interests
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                      className="input input-bordered flex-1"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeInterest(index)
                      }
                      className="btn btn-error"
                    >
                      <FaTrash />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* SAVE */}

          <div className="flex justify-center pb-10">

            <button
              type="submit"
              className="btn btn-success px-10"
            >
              Save / Update Resume
            </button>

          </div>

        </form>

        {/* PREVIEW */}

        {generatedResume && (

          <div className="mt-12">

            <div className="divider text-xl font-bold">
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