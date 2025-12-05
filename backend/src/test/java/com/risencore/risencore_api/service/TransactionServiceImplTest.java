package com.risencore.risencore_api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.risencore.risencore_api.domain.Transaction;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CreateTransactionDTO;
import com.risencore.risencore_api.dto.TransactionDTO;
import com.risencore.risencore_api.mapper.TransactionMapper;
import com.risencore.risencore_api.repository.TransactionRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock private TransactionRepository transactionRepository;

    @Mock private UserRepository userRepository;

    @Mock private TransactionMapper transactionMapper;

    @Mock private SecurityContext securityContext;

    @Mock private Authentication authentication;

    @InjectMocks private TransactionServiceImpl transactionService;

    private User testUser;
    private Transaction transaction;
    private TransactionDTO transactionDTO;
    private CreateTransactionDTO createTransactionDTO;

    @BeforeEach
    void setUp() {
        // Setup a mock user for authentication context
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        // Mock the security context to simulate an authenticated user
        when(authentication.getName()).thenReturn(testUser.getUsername());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername(testUser.getUsername()))
                .thenReturn(Optional.of(testUser));

        // Setup test data
        transaction = new Transaction();
        transactionDTO = new TransactionDTO();
        createTransactionDTO = new CreateTransactionDTO();
    }

    @Test
    @DisplayName("getTransactionsForCurrentUser should return a list of transactions")
    void getTransactionsForCurrentUser_shouldReturnTransactionList() {
        // Given
        when(transactionRepository.findByUserIdOrderByTransactionDateDesc(testUser.getId()))
                .thenReturn(Collections.singletonList(transaction));
        when(transactionMapper.toDtoList(anyList()))
                .thenReturn(Collections.singletonList(transactionDTO));

        // When
        List<TransactionDTO> result = transactionService.getTransactionsForCurrentUser();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(transactionRepository).findByUserIdOrderByTransactionDateDesc(testUser.getId());
        verify(transactionMapper).toDtoList(anyList());
    }

    @Test
    @DisplayName("createTransactionForCurrentUser should create and return a transaction")
    void createTransactionForCurrentUser_shouldCreateAndReturnTransaction() {
        // Given
        when(transactionMapper.toEntity(createTransactionDTO)).thenReturn(transaction);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(transactionMapper.toDto(transaction)).thenReturn(transactionDTO);

        // When
        TransactionDTO result =
                transactionService.createTransactionForCurrentUser(createTransactionDTO);

        // Then
        assertThat(result).isNotNull();
        verify(transactionRepository).save(transaction);
        assertThat(transaction.getUser())
                .isEqualTo(testUser); // Verify the user was set on the transaction
    }
}
