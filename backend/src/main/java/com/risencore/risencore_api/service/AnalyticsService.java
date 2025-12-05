package com.risencore.risencore_api.service;

public interface AnalyticsService {
    /**
     * Generates a weekly review summary for the current user using an AI service.
     *
     * @return A string containing the AI-generated weekly review.
     */
    String generateWeeklyReview();
}
