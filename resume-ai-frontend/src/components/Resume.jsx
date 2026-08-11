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
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center p-10">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Resume Data Found
          </h2>
        </div>
      </div>
    );
  }

  // =========================================================
  // SAFE DATA
  // =========================================================

  const personalInformation = data.personalInformation || {};

  const skills = Array.isArray(data.skills) ? data.skills : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const certifications = Array.isArray(data.certifications)
    ? data.certifications
    : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const achievements = Array.isArray(data.achievements)
    ? data.achievements
    : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const interests = Array.isArray(data.interests) ? data.interests : [];

  // =========================================================
  // HELPERS
  // =========================================================

  const getCertificationTitle = (cert) => {
    if (typeof cert === "string") return cert;

    return (
      cert?.title ||
      cert?.name ||
      cert?.certificateName ||
      cert?.certificationName ||
      cert?.certificate ||
      ""
    );
  };

  const getCertificationIssuer = (cert) => {
    return (
      cert?.issuingOrganization ||
      cert?.issuer ||
      cert?.organization ||
      cert?.provider ||
      cert?.platform ||
      ""
    );
  };

  const getCertificationYear = (cert) => {
    return (
      cert?.year ||
      cert?.date ||
      cert?.issuedYear ||
      cert?.completionYear ||
      ""
    );
  };

  const getAchievementTitle = (achievement) => {
    if (typeof achievement === "string") return achievement;

    return (
      achievement?.title ||
      achievement?.name ||
      achievement?.achievement ||
      achievement?.achievementTitle ||
      ""
    );
  };

  const getAchievementDescription = (achievement) => {
    return (
      achievement?.extraInformation ||
      achievement?.description ||
      achievement?.details ||
      achievement?.information ||
      achievement?.achievementDescription ||
      ""
    );
  };

  const getAchievementYear = (achievement) => {
    return (
      achievement?.year ||
      achievement?.date ||
      achievement?.achievementYear ||
      ""
    );
  };

  const getLanguageName = (language) => {
    if (typeof language === "string") return language;

    return (
      language?.name ||
      language?.language ||
      language?.title ||
      ""
    );
  };

  const getInterestName = (interest) => {
    if (typeof interest === "string") return interest;

    return (
      interest?.name ||
      interest?.interest ||
      interest?.title ||
      ""
    );
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

      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          margin: "0",
          transform: "none",
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const img = new Image();

      img.src = dataUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const imgRatio = img.width / img.height;
      const pageRatio = pageWidth / pageHeight;

      let finalWidth;
      let finalHeight;

      if (imgRatio > pageRatio) {
        finalWidth = pageWidth;
        finalHeight = pageWidth / imgRatio;
      } else {
        finalHeight = pageHeight;
        finalWidth = pageHeight * imgRatio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = 0;

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

      const fullName = personalInformation.fullName?.trim();

      const fileName = fullName
        ? `${fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // =========================================================
  // STYLES
  // =========================================================

  const sectionTitle = {
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    borderBottom: "1px solid #222",
    paddingBottom: "3px",
    marginBottom: "5px",
    lineHeight: "1.2",
  };

  const bodyText = {
    fontSize: "9px",
    lineHeight: "1.35",
    margin: 0,
  };

  const smallText = {
    fontSize: "8px",
    lineHeight: "1.3",
  };

  const subHeading = {
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: "1.25",
    margin: 0,
  };

  // =========================================================
  // RESUME
  // =========================================================

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: "24px 0 40px",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          A4 RESUME
      ====================================================== */}

      <div
        ref={resumeRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          height: "297mm",
          backgroundColor: "#ffffff",
          color: "#111111",
          boxSizing: "border-box",
          padding: "9mm 11mm",
          margin: "0",
          overflow: "hidden",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          display: "block",
          position: "relative",
        }}
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <header
          style={{
            width: "100%",
            textAlign: "center",
            borderBottom: "1px solid #222",
            paddingBottom: "7px",
            margin: 0,
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: "23px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              lineHeight: "1",
              margin: "0 0 4px 0",
            }}
          >
            {personalInformation.fullName || ""}
          </h1>

          {personalInformation.location && (
            <p
              style={{
                fontSize: "8px",
                color: "#555",
                margin: "0 0 4px 0",
              }}
            >
              {personalInformation.location}
            </p>
          )}

          {/* CONTACT */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px 18px",
              fontSize: "8px",
              color: "#444",
              lineHeight: "1.2",
            }}
          >
            {personalInformation.email && (
              <a
                href={`mailto:${personalInformation.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#444",
                  textDecoration: "none",
                }}
              >
                <FaEnvelope size={8} />
                {personalInformation.email}
              </a>
            )}

            {personalInformation.phoneNumber && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <FaPhone size={8} />
                {personalInformation.phoneNumber}
              </span>
            )}
          </div>

          {/* SOCIAL */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px 18px",
              fontSize: "8px",
              marginTop: "4px",
            }}
          >
            {personalInformation.gitHub && (
              <a
                href={personalInformation.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#444",
                  textDecoration: "none",
                }}
              >
                <FaGithub size={8} />
                GitHub
              </a>
            )}

            {personalInformation.linkedin && (
              <a
                href={personalInformation.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#444",
                  textDecoration: "none",
                }}
              >
                <FaLinkedin size={8} />
                LinkedIn
              </a>
            )}

            {personalInformation.portfolio && (
              <a
                href={personalInformation.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#444",
                  textDecoration: "none",
                }}
              >
                <FaGlobe size={8} />
                Portfolio
              </a>
            )}
          </div>
        </header>

        {/* =================================================
            SUMMARY
        ================================================== */}

        {data.summary && (
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>
              Professional Summary
            </h2>

            <p
              style={{
                ...bodyText,
                textAlign: "left",
              }}
            >
              {data.summary}
            </p>
          </section>
        )}

        {/* =================================================
            EDUCATION
        ================================================== */}

        {education.length > 0 && (
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>Education</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {education.map((edu, index) => (
                <div key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      {edu?.degree && (
                        <h3 style={subHeading}>
                          {edu.degree}
                        </h3>
                      )}

                      {edu?.university && (
                        <p
                          style={{
                            fontSize: "9px",
                            fontWeight: 500,
                            margin: "2px 0 0 0",
                          }}
                        >
                          {edu.university}
                        </p>
                      )}

                      {edu?.location && (
                        <p
                          style={{
                            fontSize: "8px",
                            color: "#555",
                            margin: "1px 0 0 0",
                          }}
                        >
                          {edu.location}
                        </p>
                      )}
                    </div>

                    {edu?.graduationYear && (
                      <span
                        style={{
                          fontSize: "8px",
                          whiteSpace: "nowrap",
                          color: "#444",
                        }}
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
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>
              Technical Skills
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "45px",
                rowGap: "1px",
              }}
            >
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
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      fontSize: "9px",
                      lineHeight: "1.55",
                    }}
                  >
                    <span
                      style={{
                        marginRight: "5px",
                        fontWeight: 700,
                      }}
                    >
                      •
                    </span>

                    <span>
                      <span style={{ fontWeight: 600 }}>
                        {title}
                      </span>

                      {level && (
                        <span
                          style={{
                            color: "#666",
                          }}
                        >
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
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>Experience</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {experience.map((exp, index) => (
                <div key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      {exp?.jobTitle && (
                        <h3 style={subHeading}>
                          {exp.jobTitle}
                        </h3>
                      )}

                      {(exp?.company || exp?.location) && (
                        <p
                          style={{
                            fontSize: "9px",
                            fontWeight: 500,
                            color: "#444",
                            margin: "2px 0 0 0",
                          }}
                        >
                          {exp?.company || ""}
                          {exp?.company && exp?.location
                            ? " | "
                            : ""}
                          {exp?.location || ""}
                        </p>
                      )}
                    </div>

                    {exp?.duration && (
                      <span
                        style={{
                          fontSize: "8px",
                          color: "#555",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.duration}
                      </span>
                    )}
                  </div>

                  {exp?.responsibility && (
                    <p
                      style={{
                        ...bodyText,
                        marginTop: "2px",
                      }}
                    >
                      • {exp.responsibility}
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
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>Projects</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {projects.map((project, index) => (
                <div key={index}>
                  {project?.title && (
                    <h3 style={subHeading}>
                      {project.title}
                    </h3>
                  )}

                  {project?.description && (
                    <p
                      style={{
                        ...bodyText,
                        marginTop: "2px",
                      }}
                    >
                      {project.description}
                    </p>
                  )}

                  {Array.isArray(
                    project?.technologiesUsed
                  ) &&
                    project.technologiesUsed.length > 0 && (
                      <p
                        style={{
                          fontSize: "8px",
                          color: "#555",
                          margin: "2px 0 0 0",
                        }}
                      >
                        <strong>
                          Technologies:
                        </strong>{" "}
                        {project.technologiesUsed.join(", ")}
                      </p>
                    )}

                  {project?.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#444",
                        textDecoration: "none",
                        fontSize: "8px",
                        marginTop: "2px",
                      }}
                    >
                      <FaGithub size={8} />
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
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>
              Certifications
            </h2>

            <div>
              {certifications.map((cert, index) => {
                const title =
                  getCertificationTitle(cert);

                const issuer =
                  getCertificationIssuer(cert);

                const year =
                  getCertificationYear(cert);

                return (
                  <div
                    key={index}
                    style={{
                      fontSize: "9px",
                      lineHeight: "1.5",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        marginRight: "5px",
                      }}
                    >
                      •
                    </span>

                    {title && (
                      <span style={{ fontWeight: 600 }}>
                        {title}
                      </span>
                    )}

                    {issuer && (
                      <>
                        {title ? " - " : ""}
                        <span style={{ color: "#555" }}>
                          {issuer}
                        </span>
                      </>
                    )}

                    {year && (
                      <span style={{ color: "#666" }}>
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
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>
              Achievements
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {achievements.map((achievement, index) => {
                const title =
                  getAchievementTitle(achievement);

                const description =
                  getAchievementDescription(
                    achievement
                  );

                const year =
                  getAchievementYear(achievement);

                return (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "15px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        {title && (
                          <p
                            style={{
                              fontSize: "9px",
                              fontWeight: 600,
                              lineHeight: "1.35",
                              margin: 0,
                            }}
                          >
                            <span
                              style={{
                                marginRight: "5px",
                              }}
                            >
                              •
                            </span>

                            {title}
                          </p>
                        )}

                        {description && (
                          <p
                            style={{
                              fontSize: "8px",
                              color: "#555",
                              lineHeight: "1.35",
                              margin: "1px 0 0 13px",
                            }}
                          >
                            {description}
                          </p>
                        )}
                      </div>

                      {year && (
                        <span
                          style={{
                            fontSize: "8px",
                            color: "#555",
                            whiteSpace: "nowrap",
                          }}
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
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>Languages</h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 20px",
                fontSize: "9px",
              }}
            >
              {languages.map((language, index) => {
                const name = getLanguageName(language);

                return (
                  <span key={index}>{name}</span>
                );
              })}
            </div>
          </section>
        )}

        {/* =================================================
            INTERESTS
        ================================================== */}

        {interests.length > 0 && (
          <section
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <h2 style={sectionTitle}>Interests</h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 20px",
                fontSize: "9px",
              }}
            >
              {interests.map((interest, index) => {
                const name = getInterestName(interest);

                return (
                  <span key={index}>{name}</span>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* =====================================================
          DOWNLOAD BUTTON
      ====================================================== */}

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          type="button"
          onClick={handleDownloadPdf}
          style={{
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 28px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Resume;