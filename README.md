 Resume AI- AI-Powered Resume Builder

   An AI-powered full-stack resume builder that transforms a user's description into a professional, structured IT resume and allows it to be customized and exported.

Overview

Resume AI is a full-stack web application designed to simplify the resume creation process.

Instead of manually filling out every section of a resume, users can provide a natural-language description of their education, skills, experience, projects, certifications, achievements, languages, and interests.

The application uses AI through the Spring Boot backend to transform that description into structured resume data.

What it can do 

Generate resume content using AI
Manage personal information
Add multiple work experiences
Add technical skills with proficiency levels
Add education details
Add certifications
Add projects and technologies
Add achievements
Add languages
Add professional interests
Preview the generated resume
Export the resume as PDF
User authentication/login support
Responsive user interface

Tech Stack 

Frontend 

-> React.js
-> Vite 
-> Tailwind CSS
-> Daisy UI
-> Axios 
-> jsPDF
-> html-to-image

Backend 

-> Java
-> Spring Boot
-> Spring AI
-> Spring Web 
-> Spring Data JPA
-> MySQL
-> Maven

AI

The application integrates an AI model using Groq APi to transform natural-language user description into structured resume info.

 Project Structure 

   The project is divided into two main applications:

   resume-ai-backend/
   |
   |-- resume-ai-frontend
   |   |
   |   |--src
   |   |  |--api/
   |   |  |--components/
   |   |  |--pages/
   |   |  |--services/
   |   |  |--App.jsx
   |   |  |_main.jsx
   |
   |   |--public/
   |   |-package.json
   |   |_vite.config.js
   |
   |
   |____ resume-backend/
         |
         |--src/
         |  |
         |  |--main/
         |  |  |
         |  |  |--java/
         |  |  |  |
         |  |  |  |--com/
         |  |  |  |  |
         |  |  |  |  |--resume/
         |  |  |  |  |  |
         |  |  |  |  |  |--backend/
         |  |  |  |  |  |  |--resume-ai-backend/
         |  |  |
         |  |  |__resources/
         |  |  |  |
         |  |  |  |__ resume_prompt.txt
         |  |
         |  |__ test/
         |
         |__ pom.xml
         |
         |__mnvw
