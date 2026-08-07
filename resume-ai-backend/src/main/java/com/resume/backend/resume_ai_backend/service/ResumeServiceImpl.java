package com.resume.backend.resume_ai_backend.service;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@Service
public class ResumeServiceImpl implements ResumeService{

    private final ChatClient chatClient;
    public final ObjectMapper objectMapper;
    public ResumeServiceImpl(
            ChatClient.Builder builder,
            ObjectMapper objectMapper
    ){
        this.chatClient=builder.build();
        this.objectMapper=objectMapper;
    }
    @Override
    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {

        //Load prompt from resources
        String promptString=loadPromptFromFile("resume_prompt.txt");

        //Insert user description into prompt
        String promptContent=putValuesToTemplate(
                promptString,
                Map.of(
                        "userDescription",userResumeDescription
                )
        );
        //Create AI prompt
        Prompt prompt=new Prompt(promptContent);

        //Call AI
        String response=chatClient
                .prompt(prompt)
                .call().content();

        //Parse AI response

        Map<String,Object>resumeData=parseResumeResponse(response);
        return resumeData;
    }

    //   LOAD PROMPT

    private String loadPromptFromFile(String filename) throws IOException {
        ClassPathResource resource=new ClassPathResource(filename);

        Path path=resource.getFile().toPath();
        return Files.readString(path);
    }

    //     REPLACE TEMPLATE VALUES

    private String putValuesToTemplate(
            String template,
            Map<String,String>values
    ){
        for(Map.Entry<String,String>entry:values.entrySet()){
            template=template.replace(
                    "{{"+entry.getKey()+"}}", entry.getValue()
            );
        }

        return template;
    }

    //    PARSE AI RESPONSE

    private Map<String,Object>parseResumeResponse(
            String response
    ) throws IOException {
        if(response==null || response.isBlank()){
            throw new IOException("AI returned an empty response.");
        }
        String cleanedResponse=cleanAiResponse(response);
        try{
            ObjectMapper jsonMapper=objectMapper.copy();

            JsonReadFeature[]features={
                    JsonReadFeature.ALLOW_JAVA_COMMENTS,
                    JsonReadFeature.ALLOW_YAML_COMMENTS,
                    JsonReadFeature.ALLOW_TRAILING_COMMA
            };

            for(JsonReadFeature feature:features){
                jsonMapper.configure(
                        feature.mappedFeature(),
                        true
                );
            }
            JsonNode jsonNode=
                    jsonMapper.readTree(cleanedResponse);
            if(jsonNode==null || !jsonNode.isObject()){
                throw new IOException(
                        "AI response is not a JSON object."
                );
            }

            // Convert JsonNode into Map<String,Object>

            return jsonMapper.convertValue(
                    jsonNode,
                    new TypeReference<Map<String, Object>>() {}
            );

        }catch (Exception e){
            throw new IOException(
                    "AI returned invalid JSON: "+e.getMessage(),e
            );
        }
    }

    // CLEAN AI RESPONSE

    private String cleanAiResponse(String response){
        String cleaned=response.trim();

        if(cleaned.startsWith("```json")){
            cleaned=cleaned.substring(7).trim();
        }else if(cleaned.startsWith("```")){
            cleaned=cleaned.substring(3).trim();
        }

        if(cleaned.endsWith("```")){
            cleaned=cleaned.substring(0,cleaned.length()-3).trim();
        }

        // Find first JSON object
        int firstBrace=cleaned.indexOf("{");

        // Find last JSON object
        int lastBrace=cleaned.lastIndexOf("}");

        if(firstBrace >=0 && lastBrace>=0 && lastBrace>firstBrace){
            cleaned=cleaned.substring(firstBrace,
                    lastBrace+1);
        }
        return cleaned.trim();
    }
}