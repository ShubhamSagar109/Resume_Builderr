import React, { useRef } from "react";
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import { toPng } from "html-to-image";
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

  const handleDownloadPdf = () => {
    if (!resumeRef.current) return;

    toPng(resumeRef.current, { quality: 1 })
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(dataUrl, "PNG", 10, 10, 190, 0);
        pdf.save(
          `${personalInformation.fullName || "Resume"}.pdf`
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div
        ref={resumeRef}
        className="max-w-4xl mx-auto bg-base-100 p-8 rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            {personalInformation.fullName}
          </h1>

          <p>{personalInformation.location}</p>

          <div className="flex flex-wrap justify-center gap-4 mt-3">
            {personalInformation.email && (
              <a href={`mailto:${personalInformation.email}`}>
                <FaEnvelope className="inline mr-1" />
                {personalInformation.email}
              </a>
            )}

            {personalInformation.phoneNumber && (
              <span>
                <FaPhone className="inline mr-1" />
                {personalInformation.phoneNumber}
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {personalInformation.gitHub && (
              <a
                href={personalInformation.gitHub}
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="inline mr-1" />
                GitHub
              </a>
            )}

            {personalInformation.linkedin && (
              <a
                href={personalInformation.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin className="inline mr-1" />
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="divider"></div>

        {/* Summary */}
        <section>
          <h2 className="text-2xl font-bold">Summary</h2>
          <p>{data.summary}</p>
        </section>

        {skills.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Skills</h2>

              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <div key={index} className="badge badge-outline badge-lg">
                    {skill.title} {skill.level && `- ${skill.level}`}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {experience.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Experience</h2>

              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">{exp.jobTitle}</h3>

                  <p>
                    {exp.company} | {exp.location}
                  </p>

                  <p>{exp.duration}</p>

                  <p>{exp.responsibility}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {education.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Education</h2>

              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3>{edu.degree}</h3>

                  <p>
                    {edu.university} | {edu.location}
                  </p>

                  <p>{edu.graduationYear}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {certifications.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Certifications</h2>

              {certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                  <h3>{cert.title}</h3>

                  <p>
                    {cert.issuingOrganization} {cert.year}
                  </p>
                </div>
              ))}
            </section>
          </>
        )}

        {projects.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Projects</h2>

              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <p>
                    Technologies:{" "}
                    {Array.isArray(project.technologiesUsed)
                      ? project.technologiesUsed.join(", ")
                      : project.technologiesUsed || ""}
                  </p>

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              ))}
            </section>
          </>
        )}

        {achievements.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Achievements</h2>

              {achievements.map((ach, index) => (
                <div key={index} className="mb-4">
                  <h3>{ach.title}</h3>

                  <p>{ach.year}</p>

                  <p>{ach.extraInformation}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {languages.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Languages</h2>

              <ul className="list-disc ml-6">
                {languages.map((lang, index) => (
                  <li key={index}>{lang.name}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {interests.length > 0 && (
          <>
            <div className="divider"></div>

            <section>
              <h2 className="text-2xl font-bold">Interests</h2>

              <ul className="list-disc ml-6">
                {interests.map((interest, index) => (
                  <li key={index}>{interest.name}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button onClick={handleDownloadPdf} className="btn btn-primary">
          Download PDF
        </button>
      </div>
    </>
  );
};

export default Resume;