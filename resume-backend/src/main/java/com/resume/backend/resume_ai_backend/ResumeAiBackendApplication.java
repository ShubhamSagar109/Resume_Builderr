package com.resume.backend.resume_ai_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;

@SpringBootApplication
public class ResumeAiBackendApplication {
	@Value("${spring.ai.openai.chat.options.model}")
	private String aiModel;

	@PostConstruct
	public void printModel() {
		System.out.println("=================================");
		System.out.println("AI MODEL = " + aiModel);
		System.out.println("=================================");
	}

	public static void main(String[] args) {
		SpringApplication.run(ResumeAiBackendApplication.class, args);
	}

}
