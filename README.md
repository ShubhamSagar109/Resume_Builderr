<<<<<<< HEAD
                          Resume AI ( AI-Powered Resume Builder )
=======
 Resume AI- AI-Powered Resume Builder
>>>>>>> 2871add (updated)

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
<<<<<<< HEAD
         |__mnvw

Main Features

1. AI Resume Generation
   Users can provide a description such as:
    I am a Computer Science student with experience in Java,
    Spring Boot, React.js.....
   AI processes the description and generates structured resume information.

3. Structured Resume Data
   The AI generates information in a structured format:
       {
							   "personalInformation" : {
										   "fullName" : "Shubham Sagar",
													"email" : "shubhamsagar109@gmail.com"
													"phoneNumber" : "+91 9876543210",
													"location" : null,
													"linkedIn" : null,
													"gitHub" : null,
													"portfolio" : null
										},
										"summary: "Full-stack developer...",
										"skills" : [],
										"experience: : [],
										"education" : [],
										"certifications" : [],
										"projects" : [],
										"achievements" : [],
										"languages" : [],
										"interests" : [],
							}
API Endpoints

Generate Resume

   Request : POST/api/v1/generate/generate
   Request Body 
			{
			   "userDescription: : "I am a Java full stack Developer..."
			}

			Response
			{
			    "think" : null,
							"data" : {
							   "personalInformation" : {
										   "fullName" : "Shubham Sagar",
													"email" : "shubhamsagar109@gmail.com"
													"phoneNumber" : "+91 9876543210",
													"location" : null,
													"linkedIn" : null,
													"gitHub" : null,
													"portfolio" : null
										},
										"summary: "Full-stack developer...",
										"skills" : [],
										"experience: : [],
										"education" : [],
										"certifications" : [],
										"projects" : [],
										"achievements" : [],
										"languages" : [],
										"interests" : [],
							}
			}

			Installation
			  -> Java 21
					-> Maven
					-> Node.js
					-> npm
					-> MySQL
					-> Git

			Frontend Setup

			Navigate to the frontend directory
			   - cd resume-ai-frontend

					 Install dependencies
						   * npm install
						Start the develpoment server
						   * npm run dev
						The frontend will normally run at : 
						   http://localhost:5173
						And deployed on vercel :
						   https://resume-builderr-fawn.vercel.app/

			Backend Setup

			Navigate to the backend :
			  - cd resume-backend

			Build the project:
			  * mvn clean install

			Run the Spring Boot application:
			  * mvn spring-boot:run

			The backend will normally run at:
			    http://localhost:8000
			And deployed on railway.app:
			    https://resume-builder-production-f36e.up.railway.app/

Example User Flow

 Step 1
	  User opens the application.
	Step 2
	  Clicks on Create my Resume.
	Step 3
	  User enters his/her description about himself/herself.
	Step 4
	  POST /api/v1/resume/generate
	Step 5
	  Spring Boot sends the description to the AI model.
	Step 6
	  The AI returned structured resume data.
	Step 7
	  The frontend automatically fill the resume form.
	Step 8
	  User reviews and edits the information.
	Step 9
	  The resume preview is generated.
	Step 10
	  User exports the final resume as PDF by clicking download button.
=======
         |__mnvw
>>>>>>> 2871add (updated)
