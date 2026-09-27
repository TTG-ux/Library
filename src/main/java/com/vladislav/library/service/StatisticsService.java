package com.vladislav.library.service;


import com.vladislav.library.repository.BookRepository;
import com.vladislav.library.repository.LoanRepository;
import com.vladislav.library.repository.ReaderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsService {

    private final BookRepository bookRepository;
    private final ReaderRepository readerRepository;
    private final LoanRepository loanRepository;

    public Map<String, Object> getStatistics() {
        return Map.of(
                "totalBooks", bookRepository.count(),
                "availableBooks", bookRepository.countAvailableBooks(),
                "totalReaders", readerRepository.count(),
                "activeLoans", loanRepository.countByStatus(
                        com.vladislav.library.enums.LoanStatus.ACTIVE),
                "overdueLoans", loanRepository.countOverdue()
        );
    }
}
