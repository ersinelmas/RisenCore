package com.risencore.risencore_api.service;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class GeminiAIServiceImpl implements AIService {

    private final String projectId;
    private final String location;
    private final String modelName;

    public GeminiAIServiceImpl(
            @Value("${gcp.project.id}") String projectId,
            @Value("${gcp.location}") String location,
            @Value("${gcp.model.name}") String modelName) {
        this.projectId = projectId;
        this.location = location;
        this.modelName = modelName;
    }

    @Override
    public String generateTextFromPrompt(String prompt) {
        log.info("Sending prompt to Gemini AI...");
        if (!isGcpConfigured()) {
            log.warn("GCP Project ID is not configured. Returning mock response.");
            return "This is a mock AI response because the GCP Project ID is not set. Please configure it in your environment variables.";
        }

        try (VertexAI vertexAi = new VertexAI(projectId, location)) {
            GenerativeModel model = new GenerativeModel(modelName, vertexAi);

            GenerateContentResponse response = model.generateContent(prompt);

            String textResponse = ResponseHandler.getText(response);

            log.info("Received response from Gemini AI.");
            return textResponse;
        } catch (IOException e) {
            log.error("Error communicating with Google Vertex AI service", e);
            throw new RuntimeException("Failed to generate response from AI service.", e);
        }
    }

    private boolean isGcpConfigured() {
        return this.projectId != null && !this.projectId.isEmpty() && !this.projectId.equals("your-gcp-project-id-here");
    }
}