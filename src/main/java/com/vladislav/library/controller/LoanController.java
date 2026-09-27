package com.vladislav.library.controller;

import com.vladislav.library.dto.LoanRequestDTO;
import com.vladislav.library.models.BookLoan;
import com.vladislav.library.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<BookLoan> issueBook(@Valid @RequestBody LoanRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loanService.issueBook(request));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<BookLoan> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.returnBook(id));
    }

    @GetMapping("/reader/{readerId}")
    public ResponseEntity<List<BookLoan>> getReaderHistory(@PathVariable Long readerId) {
        return ResponseEntity.ok(loanService.getReaderHistory(readerId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BookLoan>> getOverdueLoans() {
        return ResponseEntity.ok(loanService.getOverdueLoans());
    }

    @GetMapping
    public ResponseEntity<List<BookLoan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }
}
