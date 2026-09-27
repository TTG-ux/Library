package com.vladislav.library.repository;

import com.vladislav.library.enums.LoanStatus;
import com.vladislav.library.models.BookLoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<BookLoan, Long> {

    List<BookLoan> findByReaderId(Long readerId);
    List<BookLoan> findByStatus(LoanStatus status);

    @Query("SELECT l FROM BookLoan l WHERE l.dueDate < :today AND l.status = 'ACTIVE'")
    List<BookLoan> findOverdueLoans(@Param("today") LocalDate today);

    boolean existsByBookIdAndStatus(Long bookId, LoanStatus status);

    long countByStatus(LoanStatus status);

    @Query("SELECT COUNT(l) FROM BookLoan l WHERE l.dueDate < CURRENT_DATE AND l.status = 'ACTIVE'")
    long countOverdue();
}
