import React, { useRef } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);

  // =========================================================
  // SAFETY CHECK
  // =========================================================

  if (!data) {
    return (
      <div className="flex justify-center items-center mt-10 p-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            No Resume Data Found
          </h2>

          <p className="mt-2 text-gray-500">
            Please generate your resume first.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // SAFE DATA
  // =========================================================

  const personalInformation =
    data?.personalInformation &&
    typeof data.personalInformation === "object"
      ? data.personalInformation
      : {};

  const skills = Array.isArray(data?.skills) ? data.skills : [];

  const experience = Array.isArray(data?.experience)
    ? data.experience
    : [];

  const education = Array.isArray(data?.education)
    ? data.education
    : [];

  const certifications = Array.isArray(data?.certifications)
    ? data.certifications
    : [];

  const projects = Array.isArray(data?.projects)
    ? data.projects
    : [];

  const achievements = Array.isArray(data?.achievements)
    ? data.achievements
    : [];

  const languages = Array.isArray(data?.languages)
    ? data.languages
    : [];

  const interests = Array.isArray(data?.interests)
    ? data.interests
    : [];

  // =========================================================
  // HELPER FUNCTIONS
  // =========================================================

  const safeString = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value).trim();
  };

  const getCertificationTitle = (certification) => {
    if (typeof certification === "string") {
      return certification;
    }

    return safeString(
      certification?.title ||
        certification?.name ||
        certification?.certificateName ||
        certification?.certificationName ||
        certification?.certificate
    );
  };

  const getCertificationIssuer = (certification) => {
    if (!certification || typeof certification !== "object") {
      return "";
    }

    return safeString(
      certification?.issuingOrganization ||
        certification?.issuer ||
        certification?.organization ||
        certification?.provider ||
        certification?.platform
    );
  };

  const getCertificationYear = (certification) => {
    if (!certification || typeof certification !== "object") {
      return "";
    }

    return safeString(
      certification?.year ||
        certification?.date ||
        certification?.issuedYear ||
        certification?.completionYear
    );
  };

  const getAchievementTitle = (achievement) => {
    if (typeof achievement === "string") {
      return achievement;
    }

    return safeString(
      achievement?.title ||
        achievement?.name ||
        achievement?.achievement ||
        achievement?.achievementTitle
    );
  };

  const getAchievementDescription = (achievement) => {
    if (!achievement || typeof achievement !== "object") {
      return "";
    }

    return safeString(
      achievement?.extraInformation ||
        achievement?.description ||
        achievement?.details ||
        achievement?.information ||
        achievement?.achievementDescription
    );
  };

  const getAchievementYear = (achievement) => {
    if (!achievement || typeof achievement !== "object") {
      return "";
    }

    return safeString(
      achievement?.year ||
        achievement?.date ||
        achievement?.achievementYear
    );
  };

  const getLanguageName = (language) => {
    if (typeof language === "string") {
      return language;
    }

    return safeString(
      language?.name ||
        language?.language ||
        language?.title
    );
  };

  const getInterestName = (interest) => {
    if (typeof interest === "string") {
      return interest;
    }

    return safeString(
      interest?.name ||
        interest?.interest ||
        interest?.title
    );
  };

  const getSkillTitle = (skill) => {
    if (typeof skill === "string") {
      return skill;
    }

    return safeString(
      skill?.title ||
        skill?.name ||
        skill?.skill
    );
  };

  const getSkillLevel = (skill) => {
    if (!skill || typeof skill !== "object") {
      return "";
    }

    return safeString(skill?.level);
  };

  const getProjectTechnologies = (project) => {
    if (!project || typeof project !== "object") {
      return [];
    }

    if (Array.isArray(project?.technologiesUsed)) {
      return project.technologiesUsed.filter(Boolean);
    }

    if (Array.isArray(project?.technologies)) {
      return project.technologies.filter(Boolean);
    }

    return [];
  };

  // =========================================================
  // PDF DOWNLOAD
  // =========================================================

  const handleDownloadPdf = async () => {
    if (!resumeRef.current) {
      console.error("Resume element not found.");
      return;
    }

    try {
      const element = resumeRef.current;

      // Wait for browser rendering
      await new Promise((resolve) => setTimeout(resolve, 300));

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
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const image = new Image();

      image.src = dataUrl;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const imageWidth = image.width;
      const imageHeight = image.height;

      // Fit resume inside A4
      const widthRatio = pageWidth / imageWidth;
      const heightRatio = pageHeight / imageHeight;

      const scale = Math.min(widthRatio, heightRatio);

      const finalWidth = imageWidth * scale;
      const finalHeight = imageHeight * scale;

      // Center image
      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(
        dataUrl,
        "PNG",
        x,
        y,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      const fullName = safeString(
        personalInformation?.fullName
      );

      const fileName = fullName
        ? `${fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);

      alert(
        "Unable to generate PDF. Please try again."
      );
    }
  };

  // =========================================================
  // REUSABLE STYLES
  // =========================================================

  const sectionTitle =
    "text-[12px] font-bold uppercase tracking-wide border-b border-gray-300 pb-[3px]";

  const subHeading =
    "font-semibold text-[10px]";

  const bodyText =
    "text-[9px] leading-[1.35]";

  // =========================================================
  // RESUME
  // =========================================================

  return (
    <div className="w-full">

      {/* =====================================================
          A4 RESUME
      ====================================================== */}

      <div
        ref={resumeRef}
        className="
          w-[210mm]
          h-[297mm]
          mx-auto
          bg-white
          text-black
          px-[10mm]
          py-[9mm]
          overflow-hidden
          border
          border-gray-300
          shadow-xl
          box-border
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <header className="text-center border-b border-gray-400 pb-2">

          {/* NAME */}

          {personalInformation.fullName && (
            <h1
              className="
                text-[23px]
                font-bold
                uppercase
                tracking-wide
                leading-none
              "
            >
              {personalInformation.fullName}
            </h1>
          )}

          {/* LOCATION */}

          {personalInformation.location && (
            <p className="mt-1 text-[8px] text-gray-600">
              {personalInformation.location}
            </p>
          )}

          {/* EMAIL + PHONE */}

          {(personalInformation.email ||
            personalInformation.phoneNumber) && (

            <div
              className="
                flex
                flex-wrap
                justify-center
                items-center
                gap-x-4
                gap-y-0.5
                mt-1
                text-[8px]
                text-gray-700
              "
            >

              {personalInformation.email && (
                <a
                  href={`mailto:${personalInformation.email}`}
                  className="flex items-center hover:underline"
                >
                  <FaEnvelope className="mr-1 text-[8px]" />

                  {personalInformation.email}
                </a>
              )}

              {personalInformation.phoneNumber && (
                <span className="flex items-center">
                  <FaPhone className="mr-1 text-[8px]" />

                  {personalInformation.phoneNumber}
                </span>
              )}

            </div>
          )}

          {/* SOCIAL LINKS */}

          {(personalInformation.gitHub ||
            personalInformation.linkedin ||
            personalInformation.portfolio) && (

            <div
              className="
                flex
                flex-wrap
                justify-center
                items-center
                gap-x-4
                gap-y-0.5
                mt-1
                text-[8px]
              "
            >

              {personalInformation.gitHub && (
                <a
                  href={personalInformation.gitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    text-gray-700
                    hover:underline
                  "
                >
                  <FaGithub className="mr-1" />

                  GitHub
                </a>
              )}

              {personalInformation.linkedin && (
                <a
                  href={personalInformation.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    text-gray-700
                    hover:underline
                  "
                >
                  <FaLinkedin className="mr-1" />

                  LinkedIn
                </a>
              )}

              {personalInformation.portfolio && (
                <a
                  href={personalInformation.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    text-gray-700
                    hover:underline
                  "
                >
                  <FaGlobe className="mr-1" />

                  Portfolio
                </a>
              )}

            </div>
          )}

        </header>

        {/* =================================================
            PROFESSIONAL SUMMARY
        ================================================== */}

        {data.summary && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Professional Summary
            </h2>

            <p
              className={`
                mt-1
                ${bodyText}
                text-justify
              `}
            >
              {data.summary}
            </p>

          </section>
        )}

        {/* =================================================
            EDUCATION
        ================================================== */}

        {education.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Education
            </h2>

            <div className="mt-1 space-y-1.5">

              {education.map((edu, index) => (

                <div key={index}>

                  <div
                    className="
                      flex
                      justify-between
                      items-start
                      gap-3
                    "
                  >

                    <div>

                      {edu?.degree && (
                        <h3 className={subHeading}>
                          {edu.degree}
                        </h3>
                      )}

                      {edu?.university && (
                        <p className="text-[9px] font-medium text-gray-800">
                          {edu.university}
                        </p>
                      )}

                      {edu?.location && (
                        <p className="text-[8px] text-gray-600">
                          {edu.location}
                        </p>
                      )}

                    </div>

                    {edu?.graduationYear && (
                      <span
                        className="
                          text-[8px]
                          font-medium
                          text-gray-700
                          whitespace-nowrap
                        "
                      >
                        {edu.graduationYear}
                      </span>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* =================================================
            TECHNICAL SKILLS
        ================================================== */}

        {skills.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Technical Skills
            </h2>

            <div
              className="
                mt-1
                grid
                grid-cols-2
                gap-x-8
                gap-y-0
              "
            >

              {skills.map((skill, index) => {

                const title = getSkillTitle(skill);

                const level = getSkillLevel(skill);

                if (!title) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="
                      flex
                      items-start
                      text-[9px]
                      leading-4
                    "
                  >

                    <span className="mr-1 font-bold">
                      •
                    </span>

                    <span>

                      <span className="font-medium">
                        {title}
                      </span>

                      {level && (
                        <span className="text-gray-600">
                          {" "}
                          ({level})
                        </span>
                      )}

                    </span>

                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* =================================================
            EXPERIENCE
        ================================================== */}

        {experience.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Experience
            </h2>

            <div className="mt-1 space-y-1.5">

              {experience.map((exp, index) => (

                <div key={index}>

                  <div
                    className="
                      flex
                      justify-between
                      items-start
                      gap-3
                    "
                  >

                    <div>

                      {exp?.jobTitle && (
                        <h3 className={subHeading}>
                          {exp.jobTitle}
                        </h3>
                      )}

                      {(exp?.company ||
                        exp?.location) && (

                        <p className="text-[9px] font-medium text-gray-700">

                          {exp?.company || ""}

                          {exp?.company &&
                          exp?.location
                            ? " | "
                            : ""}

                          {exp?.location || ""}

                        </p>
                      )}

                    </div>

                    {exp?.duration && (
                      <span
                        className="
                          text-[8px]
                          text-gray-600
                          whitespace-nowrap
                        "
                      >
                        {exp.duration}
                      </span>
                    )}

                  </div>

                  {exp?.responsibility && (
                    <p className="mt-0.5 text-[9px] leading-[1.35]">
                      {exp.responsibility}
                    </p>
                  )}

                </div>

              ))}

            </div>

          </section>
        )}

        {/* =================================================
            PROJECTS
        ================================================== */}

        {projects.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Projects
            </h2>

            <div className="mt-1 space-y-1.5">

              {projects.map((project, index) => {

                const technologies =
                  getProjectTechnologies(project);

                return (
                  <div key={index}>

                    {project?.title && (
                      <h3 className={subHeading}>
                        {project.title}
                      </h3>
                    )}

                    {project?.description && (
                      <p className="mt-0.5 text-[9px] leading-[1.35]">
                        {project.description}
                      </p>
                    )}

                    {technologies.length > 0 && (
                      <p className="mt-0.5 text-[8px] text-gray-700">

                        <span className="font-semibold">
                          Technologies:
                        </span>

                        {" "}

                        {technologies.join(", ")}

                      </p>
                    )}

                    {project?.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          text-gray-700
                          hover:underline
                          text-[8px]
                          inline-flex
                          items-center
                          mt-0.5
                        "
                      >
                        <FaGithub className="mr-1" />

                        GitHub Repository
                      </a>
                    )}

                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* =================================================
            CERTIFICATIONS
        ================================================== */}

        {certifications.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Certifications
            </h2>

            <div className="mt-1 space-y-0.5">

              {certifications.map((cert, index) => {

                const title =
                  getCertificationTitle(cert);

                const issuer =
                  getCertificationIssuer(cert);

                const year =
                  getCertificationYear(cert);

                if (!title && !issuer && !year) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="text-[9px] leading-4"
                  >

                    <span className="mr-1 font-bold">
                      •
                    </span>

                    {title && (
                      <span className="font-semibold">
                        {title}
                      </span>
                    )}

                    {issuer && (
                      <>
                        {title ? " - " : ""}

                        <span className="text-gray-700">
                          {issuer}
                        </span>
                      </>
                    )}

                    {year && (
                      <span className="text-gray-600">
                        {" "}
                        ({year})
                      </span>
                    )}

                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* =================================================
            ACHIEVEMENTS
        ================================================== */}

        {achievements.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Achievements
            </h2>

            <div className="mt-1 space-y-1">

              {achievements.map((achievement, index) => {

                const title =
                  getAchievementTitle(achievement);

                const description =
                  getAchievementDescription(
                    achievement
                  );

                const year =
                  getAchievementYear(achievement);

                if (!title && !description && !year) {
                  return null;
                }

                return (
                  <div key={index}>

                    <div
                      className="
                        flex
                        justify-between
                        items-start
                        gap-3
                      "
                    >

                      <div className="flex-1">

                        {title && (
                          <p
                            className="
                              text-[9px]
                              font-semibold
                              leading-[1.35]
                            "
                          >

                            <span className="mr-1">
                              •
                            </span>

                            {title}

                          </p>
                        )}

                        {description && (
                          <p
                            className="
                              ml-3
                              mt-0.5
                              text-[8px]
                              text-gray-700
                              leading-[1.35]
                            "
                          >
                            {description}
                          </p>
                        )}

                      </div>

                      {year && (
                        <span
                          className="
                            text-[8px]
                            text-gray-600
                            whitespace-nowrap
                          "
                        >
                          {year}
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* =================================================
            LANGUAGES
        ================================================== */}

        {languages.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Languages
            </h2>

            <div
              className="
                mt-1
                flex
                flex-wrap
                gap-x-5
                gap-y-0.5
                text-[9px]
              "
            >

              {languages.map((language, index) => {

                const name =
                  getLanguageName(language);

                if (!name) {
                  return null;
                }

                return (
                  <span key={index}>
                    {name}
                  </span>
                );
              })}

            </div>

          </section>
        )}

        {/* =================================================
            INTERESTS
        ================================================== */}

        {interests.length > 0 && (
          <section className="mt-2.5">

            <h2 className={sectionTitle}>
              Interests
            </h2>

            <div
              className="
                mt-1
                flex
                flex-wrap
                gap-x-5
                gap-y-0.5
                text-[9px]
              "
            >

              {interests.map((interest, index) => {

                const name =
                  getInterestName(interest);

                if (!name) {
                  return null;
                }

                return (
                  <span key={index}>
                    {name}
                  </span>
                );
              })}

            </div>

          </section>
        )}

      </div>

      {/* =====================================================
          DOWNLOAD BUTTON
      ====================================================== */}

      <div className="flex justify-center mt-5 mb-8">

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            font-semibold
            px-8
            py-2.5
            rounded-lg
            shadow-md
            transition
            duration-200
            cursor-pointer
          "
        >
          Download PDF
        </button>

      </div>

    </div>
  );
};

export default Resume;