package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Endpoints for data analysis and insights")
@SecurityRequirement(name = "bearerAuth") // This endpoint requires authentication
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Operation(
            summary = "Generate Weekly Review",
            description =
                    "Analyzes the current user's data from the last 7 days and generates a personalized weekly review using an AI service.",
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Successfully generated and returned the review text."),
                @ApiResponse(
                        responseCode = "500",
                        description =
                                "Internal server error, e.g., failed to contact the AI service.")
            })
    @GetMapping("/weekly-review")
    public ResponseEntity<String> getWeeklyReview() {
        String review = analyticsService.generateWeeklyReview();
        return ResponseEntity.ok(review);
    }
}
