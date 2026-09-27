package com.vladislav.library.service;

import com.vladislav.library.dto.LoanRequestDTO;
import com.vladislav.library.enums.LoanStatus;
import com.vladislav.library.exception.*;
import com.vladislav.library.models.Book;
import com.vladislav.library.models.BookLoan;
import com.vladislav.library.repository.BookRepository;
import com.vladislav.library.repository.LoanRepository;
import com.vladislav.library.repository.ReaderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final ReaderRepository readerRepository;

    public BookLoan issueBook(LoanRequestDTO request) {
        var book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Книга", request.getBookId()));
        var reader = readerRepository.findById(request.getReaderId())
                .orElseThrow(() -> new ResourceNotFoundException("Читатель", request.getReaderId()));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Нет доступных экземпляров книги");
        }

        if (loanRepository.existsByBookIdAndStatus(book.getId(), LoanStatus.ACTIVE)) {
            throw new RuntimeException("Книга уже выдана");
        }

        if (request.getDueDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Срок возврата не может быть в прошлом");
        }

        BookLoan loan = BookLoan.builder()
                .book(book)
                .reader(reader)
                .loanDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .status(LoanStatus.ACTIVE)
                .build();

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return loanRepository.save(loan);
    }

    public BookLoan returnBook(Long loanId) {
        BookLoan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Запись о выдаче", loanId));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new RuntimeException("Книга уже возвращена");
        }

        loan.setReturnDate(LocalDate.now());
        loan.setStatus(LoanStatus.RETURNED);

        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return loanRepository.save(loan);
    }

    public List<BookLoan> getReaderHistory(Long readerId) {
        readerRepository.findById(readerId)
                .orElseThrow(() -> new ResourceNotFoundException("Читатель", readerId));
        return loanRepository.findByReaderId(readerId);
    }

    public List<BookLoan> getOverdueLoans() {
        return loanRepository.findOverdueLoans(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<BookLoan> getAllLoans() {
        return loanRepository.findAll();
    }
}
