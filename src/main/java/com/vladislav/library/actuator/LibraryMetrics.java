package com.vladislav.library.actuator;


import com.vladislav.library.repository.BookRepository;
import com.vladislav.library.repository.LoanRepository;
import com.vladislav.library.repository.ReaderRepository;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LibraryMetrics {

    private final MeterRegistry meterRegistry;
    private final BookRepository bookRepository;
    private final ReaderRepository readerRepository;
    private final LoanRepository loanRepository;

    @PostConstruct
    public void registerMetrics() {
        Gauge.builder("library.books.total", bookRepository, BookRepository::count)
                .description("Общее количество книг")
                .register(meterRegistry);

        Gauge.builder("library.readers.total", readerRepository, ReaderRepository::count)
                .description("Общее количество читателей")
                .register(meterRegistry);

        Gauge.builder("library.loans.active", loanRepository,
                        repo -> repo.countByStatus(com.vladislav.library.enums.LoanStatus.ACTIVE))
                .description("Активные выдачи")
                .register(meterRegistry);
    }
}
