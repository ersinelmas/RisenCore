package com.risencore.risencore_api.controller;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.risencore.risencore_api.BaseIntegrationTest;
import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.domain.Transaction;
import com.risencore.risencore_api.domain.TransactionType;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.service.AIService;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;

class AnalyticsControllerIT extends BaseIntegrationTest {

    @MockBean private AIService aiService;

    private String userToken;
    private User currentUser;

    @BeforeEach
    void init() throws Exception {
        currentUser = createTestUser("analytics_user", "password", Role.USER);
        userToken = getJwtToken(currentUser.getUsername(), "password");

        Task task = new Task();
        task.setDescription("Finish report");
        task.setUser(currentUser);
        taskRepository.save(task);

        Transaction transaction = new Transaction();
        transaction.setAmount(new BigDecimal("10.00"));
        transaction.setCategory(com.risencore.risencore_api.domain.Category.GROCERIES);
        transaction.setType(TransactionType.EXPENSE);
        transaction.setTransactionDate(LocalDate.now());
        transaction.setUser(currentUser);
        transactionRepository.save(transaction);
    }

    @Test
    @DisplayName("GET /api/v1/analytics/weekly-review should generate and cache reviews")
    void weeklyReview_generatesAndReusesCachedValue() throws Exception {
        when(aiService.generateTextFromPrompt(Mockito.anyString())).thenReturn("Weekly summary");

        mockMvc.perform(get("/api/v1/analytics/weekly-review").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is("Weekly summary")));

        mockMvc.perform(get("/api/v1/analytics/weekly-review").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is("Weekly summary")));

        verify(aiService, times(1)).generateTextFromPrompt(Mockito.anyString());
    }

    @Test
    @DisplayName("Unauthorized analytics requests should return 401")
    void weeklyReview_requiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/weekly-review"))
                .andExpect(status().isUnauthorized());
    }
}
