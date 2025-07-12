package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Transaction;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CategoryExpenseDTO;
import com.risencore.risencore_api.dto.CreateTransactionDTO;
import com.risencore.risencore_api.dto.TransactionDTO;
import com.risencore.risencore_api.mapper.TransactionMapper;
import com.risencore.risencore_api.repository.TransactionRepository;
import com.risencore.risencore_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactionsForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(currentUser.getId());
        return transactionMapper.toDtoList(transactions);
    }

    @Override
    @Transactional
    public TransactionDTO createTransactionForCurrentUser(CreateTransactionDTO createDto) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionMapper.toEntity(createDto);
        transaction.setUser(currentUser);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return transactionMapper.toDto(savedTransaction);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Current user not found in database"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryExpenseDTO> getExpenseSummaryByCategoryForCurrentUser() {
        User currentUser = getCurrentUser();
        return transactionRepository.findExpenseSummaryByCategory(currentUser.getId());
    }
}