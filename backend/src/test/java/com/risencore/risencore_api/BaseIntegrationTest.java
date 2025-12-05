package com.risencore.risencore_api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.LoginRequestDTO;
import com.risencore.risencore_api.repository.TaskRepository;
import com.risencore.risencore_api.repository.TransactionRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public abstract class BaseIntegrationTest {

    @Autowired protected MockMvc mockMvc;

    @Autowired protected UserRepository userRepository;

    @Autowired protected TransactionRepository transactionRepository;

    @Autowired protected TaskRepository taskRepository;

    @Autowired protected PasswordEncoder passwordEncoder;

    @Autowired protected ObjectMapper objectMapper;

    @BeforeEach
    void setUpBase() {
        // Clean up dependent tables FIRST, then the main user table.
        transactionRepository.deleteAll();
        taskRepository.deleteAll();
        userRepository.deleteAll();
    }

    protected String getJwtToken(String username, String password) throws Exception {
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);

        MvcResult result =
                mockMvc.perform(
                                post("/api/auth/login")
                                        .contentType("application/json")
                                        .content(objectMapper.writeValueAsString(loginRequest)))
                        .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        // A simple way to parse the token from the JSON response
        return objectMapper.readTree(responseBody).get("token").asText();
    }

    protected User createTestUser(String username, String password, Role... roles) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(username + "@test.com");
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Set.of(roles));
        return userRepository.save(user);
    }
}
