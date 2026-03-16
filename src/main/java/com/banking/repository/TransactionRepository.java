package com.banking.repository;

import com.banking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find all transactions for a specific account, usually we might want to sort by timestamp
    List<Transaction> findByAccountIdOrderByTimestampDesc(Long accountId);
}
