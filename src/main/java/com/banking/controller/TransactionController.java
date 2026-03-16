package com.banking.controller;

import com.banking.dto.TransactionDto;
import com.banking.dto.TransferRequest;
import com.banking.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionDto> deposit(@RequestParam String accountNumber, @RequestParam BigDecimal amount) {
        TransactionDto transaction = transactionService.deposit(accountNumber, amount);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionDto> withdraw(@RequestParam String accountNumber, @RequestParam BigDecimal amount) {
        TransactionDto transaction = transactionService.withdraw(accountNumber, amount);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDto> transfer(@RequestBody TransferRequest transferRequest) {
        TransactionDto transaction = transactionService.transfer(
                transferRequest.getFromAccountNumber(),
                transferRequest.getToAccountNumber(),
                transferRequest.getAmount()
        );
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<TransactionDto>> getTransactionHistory(@PathVariable String accountNumber) {
        List<TransactionDto> transactions = transactionService.getTransactionHistory(accountNumber);
        return ResponseEntity.ok(transactions);
    }
}
