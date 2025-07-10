package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.dto.CreateTransactionDTO;
import com.risencore.risencore_api.dto.TransactionDTO;
import com.risencore.risencore_api.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction Management", description = "Endpoints for managing user's financial transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Operation(
            summary = "Get All Transactions for Current User",
            description = "Retrieves a list of all financial transactions for the currently authenticated user, ordered by date descending.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactionsForCurrentUser() {
        List<TransactionDTO> transactions = transactionService.getTransactionsForCurrentUser();
        return ResponseEntity.ok(transactions);
    }

    @Operation(
            summary = "Create a New Transaction",
            description = "Creates a new financial transaction (income or expense) for the currently authenticated user.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransactionForCurrentUser(@Valid @RequestBody CreateTransactionDTO createDto) {
        TransactionDTO newTransaction = transactionService.createTransactionForCurrentUser(createDto);
        return new ResponseEntity<>(newTransaction, HttpStatus.CREATED);
    }
}