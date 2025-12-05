package com.risencore.risencore_api.service;

/**
 * An interface for abstracting interactions with a third-party AI service. This allows for swapping
 * AI providers (e.g., Google Gemini, OpenAI) without changing the core business logic of the
 * application.
 */
public interface AIService {

    /**
     * Generates a text-based response from a given prompt. q
     *
     * @param prompt The input text/prompt to send to the AI model.
     * @return The generated text content as a String.
     * @throws RuntimeException if the AI service fails to generate a response.
     */
    String generateTextFromPrompt(String prompt);
}
