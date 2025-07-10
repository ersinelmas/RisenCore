package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.BaseIntegrationTest;
import com.risencore.risencore_api.domain.Category;
import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.TransactionType;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CreateTransactionDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TransactionControllerIT extends BaseIntegrationTest {

    private String userToken;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Create a user and get their token before each test
        testUser = createTestUser("tx_user", "password123", Role.USER);
        try {
            userToken = getJwtToken("tx_user", "password123");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get JWT token in test setup", e);
        }
    }

    @Test
    @DisplayName("POST /api/v1/transactions - Should create a new transaction for the authenticated user")
    void givenTransactionRequest_whenCreateTransaction_thenReturns201() throws Exception {
        // Given
        CreateTransactionDTO createDto = new CreateTransactionDTO();
        createDto.setDescription("Monthly Salary");
        createDto.setAmount(new BigDecimal("5000.00"));
        createDto.setType(TransactionType.INCOME);
        createDto.setCategory(Category.SALARY);
        createDto.setTransactionDate(LocalDate.now());

        // When
        ResultActions response = mockMvc.perform(post("/api/v1/transactions")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)));

        // Then
        response.andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description", is("Monthly Salary")))
                .andExpect(jsonPath("$.amount", is(5000.00)));
    }

    @Test
    @DisplayName("GET /api/v1/transactions - Should return transactions for the authenticated user")
    void givenUserHasTransactions_whenGetTransactions_thenReturnsTransactionList() throws Exception {
        // Given: Create a transaction first
        CreateTransactionDTO createDto = new CreateTransactionDTO();
        createDto.setDescription("Groceries");
        createDto.setAmount(new BigDecimal("150.50"));
        createDto.setType(TransactionType.EXPENSE);
        createDto.setCategory(Category.GROCERIES);
        createDto.setTransactionDate(LocalDate.now());

        mockMvc.perform(post("/api/v1/transactions")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)));

        // When
        ResultActions response = mockMvc.perform(get("/api/v1/transactions")
                .header("Authorization", "Bearer " + userToken));

        // Then
        response.andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.size()", is(1)))
                .andExpect(jsonPath("$[0].description", is("Groceries")));
    }
}