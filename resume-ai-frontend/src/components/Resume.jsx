import React, { useRef } from "react";
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);

  if (!data) {
    return (
      <div className="text-center mt-10">
        <h2>No Resume Data Found</h2>
      </div>
    );
  }

  const personalInformation = data.personalInformation || {};

  const skills = data.skills || [];
  const experience = data.experience || [];
  const education = data.education || [];
  const certifications = data.certifications || [];
  const projects = data.projects || [];
  const achievements = data.achievements || [];
  const languages = data.languages || [];
  const interests = data.interests || [];

  const handleDownloadPdf = async () => {
  if (!resumeRef.current) return;

  const previousTheme =
    document.documentElement.classList.contains("dark");

  document.documentElement.classList.remove("dark");

  const resume = resumeRef.current;

  resume.style.background = "#ffffff";
  resume.style.color = "#000000";

  try {
    const canvas = await html2canvas(resume, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollY: -window.scrollY,
      windowWidth: resume.scrollWidth,
      windowHeight: resume.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.75);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      heightLeft -= pdfHeight;
    }

    pdf.save(`${personalInformation.fullName || "Resume"}.pdf`);
  } finally {
    resume.style.background = "";
    resume.style.color = "";

    if (previousTheme) {
      document.documentElement.classList.add("dark");
    }
  }
};


  return (
    <>
      <div
        ref={resumeRef}
        id="resume"
        className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black p-8 border border-gray-300"
      >
        {/* ================= HEADER ================= */}
        <div className="text-center border-b-2 border-gray-400 pb-4">
          <h1 className="text-4xl font-bold uppercase tracking-wide">
            {personalInformation.fullName}
          </h1>

          <div className="mt-2 text-sm flex flex-wrap justify-center gap-4 text-gray-700">
            {personalInformation.location && (
              <span>{personalInformation.location}</span>
            )}

            {personalInformation.phoneNumber && (
              <span>
                <FaPhone className="inline mr-1" />
                {personalInformation.phoneNumber}
              </span>
            )}

            {personalInformation.email && (
              <span>
                <FaEnvelope className="inline mr-1" />
                {personalInformation.email}
              </span>
            )}
          </div>

          <div className="mt-2 flex justify-center flex-wrap gap-5 text-sm">
            {personalInformation.linkedin && (
              <a
                href={personalInformation.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline"
              >
                <FaLinkedin className="inline mr-1" />
                LinkedIn
              </a>
            )}

            {personalInformation.gitHub && (
              <a
                href={personalInformation.gitHub}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline"
              >
                <FaGithub className="inline mr-1" />
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        {data.summary && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Professional Summary
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-justify">
              {data.summary}
            </p>
          </section>
        )}

        {/* ================= SKILLS ================= */}
        {skills.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Technical Skills
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2 text-black font-bold">•</span>
                  <span className="text-[15px]">
                    {skill.title}
                    {skill.level && ` (${skill.level})`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= EDUCATION ================= */}
        {education.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Education
            </h2>
            <div className="mt-4 space-y-5">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-[16px]">
                      {edu.degree}
                    </h3>
                    <span className="text-gray-700">
                      {edu.graduationYear}
                    </span>
                  </div>
                  <p className="text-[15px]">{edu.university}</p>
                  {edu.location && (
                    <p className="text-gray-600 text-sm">{edu.location}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= EXPERIENCE ================= */}
        {experience.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Experience
            </h2>
            <div className="mt-4 space-y-5">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-[16px]">
                      {exp.jobTitle}
                    </h3>
                    <span className="text-gray-700">{exp.duration}</span>
                  </div>
                  <p className="italic text-gray-700">
                    {exp.company}
                    {exp.location && ` | ${exp.location}`}
                  </p>
                  <p className="mt-2 text-[15px] leading-6">
                    {exp.responsibility}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= PROJECTS ================= */}
        {projects.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Projects
            </h2>
            <div className="mt-4 space-y-5">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-[16px]">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-6">
                    {project.description}
                  </p>
                  {project.technologiesUsed && (
                    <p className="mt-2">
                      <strong>Technologies:</strong>{" "}
                      {Array.isArray(project.technologiesUsed)
                        ? project.technologiesUsed.join(", ")
                        : project.technologiesUsed}
                    </p>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      GitHub Repository
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= CERTIFICATIONS ================= */}
        {certifications.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Certifications
            </h2>
            <ul className="mt-4 space-y-2">
              {certifications.map((cert, index) => (
                <li key={index}>
                  <strong>{cert.title}</strong>
                  {cert.issuingOrganization && ` - ${cert.issuingOrganization}`}
                  {cert.year && ` (${cert.year})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ================= LANGUAGES ================= */}
        {languages.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Languages
            </h2>
            <p className="mt-3">
              {languages.map((lang) => lang.name).join(", ")}
            </p>
          </section>
        )}

        {/* ================= INTERESTS ================= */}
        {interests.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 pb-1">
              Interests
            </h2>
            <p className="mt-3">
              {interests.map((interest) => interest.name).join(", ")}
            </p>
          </section>
        )}
      </div>

      {/* Download Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleDownloadPdf}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          Download PDF
        </button>
      </div>
    </>
  );
};

export default Resume;