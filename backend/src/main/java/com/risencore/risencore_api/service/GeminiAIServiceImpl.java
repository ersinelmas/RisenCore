package com.risencore.risencore_api.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GeminiAIServiceImpl implements AIService {

    private final Client client;

    public GeminiAIServiceImpl(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder().apiKey(apiKey).build();
    }

    @Override
    public String generateTextFromPrompt(String prompt) {
        try {
            log.info("Sending prompt to Gemini (google-genai SDK)...");
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    null);

            String textResponse = response.text();
            log.info("Received response from Gemini API.");
            return textResponse != null ? textResponse : "No response from Gemini.";
        } catch (Exception e) {
            log.error("Error communicating with Gemini API", e);
            throw new RuntimeException("Failed to generate response from Gemini API.", e);
        }
    }
}
