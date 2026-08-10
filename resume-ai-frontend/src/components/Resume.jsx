import React, { useRef } from "react";
import "daisyui/dist/full.css";

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
      <div className="text-center mt-10 p-10">
        <h2 className="text-2xl font-semibold">
          No Resume Data Found
        </h2>
      </div>
    );
  }

  // =========================================================
  // SAFE DATA
  // =========================================================

  const personalInformation = data.personalInformation || {};

  const skills = Array.isArray(data.skills)
    ? data.skills
    : [];

  const experience = Array.isArray(data.experience)
    ? data.experience
    : [];

  const education = Array.isArray(data.education)
    ? data.education
    : [];

  const certifications = Array.isArray(data.certifications)
    ? data.certifications
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects
    : [];

  const achievements = Array.isArray(data.achievements)
    ? data.achievements
    : [];

  const languages = Array.isArray(data.languages)
    ? data.languages
    : [];

  const interests = Array.isArray(data.interests)
    ? data.interests
    : [];

  // =========================================================
  // PDF DOWNLOAD (IMPROVED VERSION)
  // =========================================================

  const handleDownloadPdf = async () => {
    if (!resumeRef.current) {
      console.error("Resume element not found.");
      return;
    }

    try {
      const element = resumeRef.current;

      // Wait for any pending renders
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the resume as an image
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Load image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Calculate image dimensions to fit A4
      const imageWidth = pdfWidth;
      const imageHeight = (img.height * imageWidth) / img.width;

      let position = 0;
      let heightLeft = imageHeight;

      // Add first page
      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        position,
        imageWidth,
        imageHeight
      );

      heightLeft -= pdfHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = -((imageHeight - heightLeft) - pdfHeight);
        pdf.addPage();
        pdf.addImage(
          dataUrl,
          "PNG",
          0,
          position,
          imageWidth,
          imageHeight
        );
        heightLeft -= pdfHeight;
      }

      // Generate filename
      const fullName = personalInformation.fullName?.trim();
      const fileName = fullName
        ? `${fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      pdf.save(fileName);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You might want to show a toast notification here
    }
  };

  // =========================================================
  // REUSABLE STYLES
  // =========================================================

  const sectionTitle =
    "text-[13px] font-bold uppercase tracking-wide border-b border-gray-300 pb-1";

  const subHeading =
    "font-semibold text-[11px]";

  const bodyText =
    "text-[10px] leading-[1.45]";

  return (
    <>
      {/* =====================================================
          RESUME
      ====================================================== */}

      <div
        ref={resumeRef}
        className="
          w-[210mm]
          min-h-[297mm]
          mx-auto
          bg-white
          text-black
          px-[16mm]
          py-[12mm]
          shadow-xl
          border
          border-gray-300
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <header className="text-center border-b border-gray-400 pb-3">

          {/* NAME */}

          <h1 className="
            text-[25px]
            font-bold
            uppercase
            tracking-wide
          ">
            {personalInformation.fullName || ""}
          </h1>

          {/* LOCATION */}

          {personalInformation.location && (
            <p className="
              mt-0.5
              text-[9px]
              text-gray-600
            ">
              {personalInformation.location}
            </p>
          )}

          {/* EMAIL + PHONE */}

          <div className="
            flex
            flex-wrap
            justify-center
            items-center
            gap-x-4
            gap-y-1
            mt-1.5
            text-[9px]
            text-gray-700
          ">

            {personalInformation.email && (
              <a
                href={`mailto:${personalInformation.email}`}
                className="flex items-center hover:underline"
              >
                <FaEnvelope className="mr-1" />

                {personalInformation.email}
              </a>
            )}

            {personalInformation.phoneNumber && (
              <span className="flex items-center">
                <FaPhone className="mr-1" />

                {personalInformation.phoneNumber}
              </span>
            )}

          </div>

          {/* GITHUB + LINKEDIN + PORTFOLIO */}

          <div className="
            flex
            flex-wrap
            justify-center
            items-center
            gap-x-4
            gap-y-1
            mt-1
            text-[9px]
          ">

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

        </header>


        {/* =================================================
            PROFESSIONAL SUMMARY
        ================================================== */}

        {data.summary && (
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Professional Summary
            </h2>

            <p className={`
              mt-1.5
              ${bodyText}
              text-justify
            `}>
              {data.summary}
            </p>

          </section>
        )}


        {/* =================================================
            EDUCATION
        ================================================== */}

        {education.length > 0 && (
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Education
            </h2>

            <div className="mt-1.5 space-y-2">

              {education.map((edu, index) => (
                <div key={index}>

                  <div className="
                    flex
                    justify-between
                    items-start
                    gap-3
                  ">

                    <div>

                      {edu?.degree && (
                        <h3 className={subHeading}>
                          {edu.degree}
                        </h3>
                      )}

                      {edu?.university && (
                        <p className="
                          text-[10px]
                          font-medium
                          text-gray-800
                        ">
                          {edu.university}
                        </p>
                      )}

                      {edu?.location && (
                        <p className="
                          text-[9px]
                          text-gray-600
                        ">
                          {edu.location}
                        </p>
                      )}

                    </div>

                    {edu?.graduationYear && (
                      <span className="
                        text-[10px]
                        font-medium
                        text-gray-700
                        whitespace-nowrap
                      ">
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
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Technical Skills
            </h2>

            <div className="
              mt-1.5
              grid
              grid-cols-2
              gap-x-8
              gap-y-0.5
            ">

              {skills.map((skill, index) => {

                const title =
                  typeof skill === "string"
                    ? skill
                    : skill?.title || "";

                const level =
                  typeof skill === "object"
                    ? skill?.level || ""
                    : "";

                return (
                  <div
                    key={index}
                    className="
                      flex
                      items-start
                      text-[10px]
                      leading-4
                    "
                  >

                    <span className="
                      mr-1.5
                      font-bold
                    ">
                      •
                    </span>

                    <span>

                      <span className="
                        font-medium
                      ">
                        {title}
                      </span>

                      {level && (
                        <span className="
                          text-gray-600
                        ">
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
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Experience
            </h2>

            <div className="mt-1.5 space-y-2.5">

              {experience.map((exp, index) => (
                <div key={index}>

                  <div className="
                    flex
                    justify-between
                    items-start
                    gap-3
                  ">

                    <div>

                      {exp?.jobTitle && (
                        <h3 className={subHeading}>
                          {exp.jobTitle}
                        </h3>
                      )}

                      {(exp?.company ||
                        exp?.location) && (
                        <p className="
                          text-[10px]
                          font-medium
                          text-gray-700
                        ">
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
                      <span className="
                        text-[9px]
                        text-gray-600
                        whitespace-nowrap
                      ">
                        {exp.duration}
                      </span>
                    )}

                  </div>

                  {exp?.responsibility && (
                    <p className="
                      mt-0.5
                      text-[10px]
                      leading-[1.45]
                    ">
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
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Projects
            </h2>

            <div className="mt-1.5 space-y-2.5">

              {projects.map((project, index) => (
                <div key={index}>

                  {project?.title && (
                    <h3 className={subHeading}>
                      {project.title}
                    </h3>
                  )}

                  {project?.description && (
                    <p className="
                      mt-0.5
                      text-[10px]
                      leading-[1.45]
                    ">
                      {project.description}
                    </p>
                  )}

                  {Array.isArray(
                    project?.technologiesUsed
                  ) &&
                    project.technologiesUsed.length > 0 && (
                      <p className="
                        mt-0.5
                        text-[9px]
                        text-gray-700
                      ">

                        <span className="font-semibold">
                          Technologies:
                        </span>{" "}

                        {project.technologiesUsed.join(", ")}

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
                        text-[9px]
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
              ))}

            </div>

          </section>
        )}


        {/* =================================================
            CERTIFICATIONS
        ================================================== */}

        {certifications.length > 0 && (
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Certifications
            </h2>

            <div className="
              mt-1.5
              space-y-1
            ">

              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="text-[10px] leading-4"
                >

                  {cert?.title && (
                    <span className="font-semibold">
                      {cert.title}
                    </span>
                  )}

                  {cert?.issuingOrganization && (
                    <>
                      {" - "}
                      <span className="text-gray-700">
                        {cert.issuingOrganization}
                      </span>
                    </>
                  )}

                  {cert?.year && (
                    <span className="text-gray-600">
                      {" "}
                      ({cert.year})
                    </span>
                  )}

                </div>
              ))}

            </div>

          </section>
        )}


        {/* =================================================
            ACHIEVEMENTS
        ================================================== */}

        {achievements.length > 0 && (
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Achievements
            </h2>

            <div className="
              mt-1.5
              space-y-1.5
            ">

              {achievements.map(
                (achievement, index) => (
                  <div key={index}>

                    <div className="
                      flex
                      justify-between
                      items-start
                      gap-3
                    ">

                      <h3 className="
                        font-semibold
                        text-[10px]
                      ">
                        {achievement?.title || ""}
                      </h3>

                      {achievement?.year && (
                        <span className="
                          text-[9px]
                          text-gray-600
                          whitespace-nowrap
                        ">
                          {achievement.year}
                        </span>
                      )}

                    </div>

                    {achievement?.extraInformation && (
                      <p className="
                        mt-0.5
                        text-[9px]
                        leading-4
                      ">
                        {achievement.extraInformation}
                      </p>
                    )}

                  </div>
                )
              )}

            </div>

          </section>
        )}


        {/* =================================================
            LANGUAGES
        ================================================== */}

        {languages.length > 0 && (
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Languages
            </h2>

            <div className="
              mt-1.5
              flex
              flex-wrap
              gap-x-5
              gap-y-1
              text-[10px]
            ">

              {languages.map(
                (language, index) => (
                  <span key={index}>
                    {language?.name || ""}
                  </span>
                )
              )}

            </div>

          </section>
        )}


        {/* =================================================
            INTERESTS
        ================================================== */}

        {interests.length > 0 && (
          <section className="mt-3">

            <h2 className={sectionTitle}>
              Interests
            </h2>

            <div className="
              mt-1.5
              flex
              flex-wrap
              gap-x-5
              gap-y-1
              text-[10px]
            ">

              {interests.map(
                (interest, index) => (
                  <span key={index}>
                    {interest?.name || ""}
                  </span>
                )
              )}

            </div>

          </section>
        )}

      </div>


      {/* =====================================================
          DOWNLOAD BUTTON
      ====================================================== */}

      <div className="
        flex
        justify-center
        mt-4
        mb-8
      ">

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="
            btn
            btn-primary
            px-8
          "
        >
          Download PDF
        </button>

      </div>
    </>
  );
};

export default Resume;