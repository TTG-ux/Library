package com.vladislav.library.config;

import com.vladislav.library.enums.Role;
import com.vladislav.library.models.Book;
import com.vladislav.library.models.Reader;
import com.vladislav.library.models.User;
import com.vladislav.library.repository.BookRepository;
import com.vladislav.library.repository.ReaderRepository;
import com.vladislav.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ReaderRepository readerRepository;
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Инициализация тестовых данных...");

        // Создание администратора
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);
        log.info("✅ Создан администратор: admin / admin123");

        // Создание тестового читателя
        User readerUser = User.builder()
                .username("reader")
                .password(passwordEncoder.encode("reader123"))
                .role(Role.READER)
                .enabled(true)
                .build();
        readerUser = userRepository.save(readerUser);

        Reader reader = Reader.builder()
                .user(readerUser)
                .firstName("Иван")
                .lastName("Петров")
                .email("reader@library.com")
                .phone("+79001234567")
                .registrationDate(LocalDate.now())
                .build();
        readerRepository.save(reader);
        log.info("✅ Создан читатель: reader / reader123");

        // Создание тестовых книг
        Book book1 = Book.builder()
                .title("Война и мир")
                .author("Лев Толстой")
                .isbn("9780199232765")
                .publicationYear(1869)
                .totalCopies(5)
                .availableCopies(5)
                .build();
        bookRepository.save(book1);

        Book book2 = Book.builder()
                .title("Преступление и наказание")
                .author("Фёдор Достоевский")
                .isbn("9780140449136")
                .publicationYear(1866)
                .totalCopies(3)
                .availableCopies(3)
                .build();
        bookRepository.save(book2);

        Book book3 = Book.builder()
                .title("Мастер и Маргарита")
                .author("Михаил Булгаков")
                .isbn("9780679760801")
                .publicationYear(1967)
                .totalCopies(4)
                .availableCopies(4)
                .build();
        bookRepository.save(book3);

        log.info("✅ Создано 3 тестовые книги");
        log.info("===========================================");
        log.info("Тестовые данные инициализированы!");
        log.info("Администратор: admin / admin123");
        log.info("Читатель: reader / reader123");
        log.info("===========================================");
    }
}
