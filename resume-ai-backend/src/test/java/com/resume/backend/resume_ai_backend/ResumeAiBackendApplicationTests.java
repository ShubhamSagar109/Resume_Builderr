package com.resume.backend.resume_ai_backend;

import com.resume.backend.resume_ai_backend.service.ResumeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ResumeAiBackendApplicationTests {
	@Autowired
	private ResumeService resumeService;

	@Test
	void contextLoads() throws Exception {

		resumeService.generateResumeResponse("I am Suhani Sagar with 2 year of java experience .");

	}

}
