package com.vladislav.library.service;

import com.vladislav.library.dto.BookDTO;
import com.vladislav.library.exception.DuplicateIsbnException;
import com.vladislav.library.exception.InvalidDataException;
import com.vladislav.library.exception.NoAvailableCopiesException;
import com.vladislav.library.exception.ResourceNotFoundException;
import com.vladislav.library.models.Book;
import com.vladislav.library.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookService {
    private final BookRepository bookRepository;

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BookDTO getBookById(Long id) {
        return toDTO(bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Книга", id)));
    }

    public BookDTO createBook(BookDTO dto) {
        bookRepository.findByIsbn(dto.getIsbn())
                .ifPresent(b -> { throw new DuplicateIsbnException(dto.getIsbn()); });

        Book book = toEntity(dto);
        if (book.getAvailableCopies() == null) book.setAvailableCopies(book.getTotalCopies());
        if (book.getAvailableCopies() > book.getTotalCopies())
            throw new InvalidDataException("Доступные копии не могут превышать общее количество");

        return toDTO(bookRepository.save(book));
    }

    public BookDTO updateBook(Long id, BookDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Книга", id));

        if (!book.getIsbn().equals(dto.getIsbn()))
            bookRepository.findByIsbn(dto.getIsbn())
                    .ifPresent(b -> { throw new DuplicateIsbnException(dto.getIsbn()); });

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setPublicationYear(dto.getPublicationYear());
        book.setTotalCopies(dto.getTotalCopies());
        book.setAvailableCopies(dto.getAvailableCopies());

        return toDTO(bookRepository.save(book));
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Книга", id));
        bookRepository.delete(book);
    }

    public List<BookDTO> searchBooks(String title, String author, String isbn,
                                     Integer year, Boolean available) {
        return bookRepository.searchBooks(title, author, isbn, year, available)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void decreaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Книга", bookId));
        if (book.getAvailableCopies() <= 0) throw new NoAvailableCopiesException(bookId);
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);
    }

    public void increaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Книга", bookId));
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
    }

    private BookDTO toDTO(Book b) {
        return BookDTO.builder().id(b.getId()).title(b.getTitle()).author(b.getAuthor())
                .isbn(b.getIsbn()).publicationYear(b.getPublicationYear())
                .totalCopies(b.getTotalCopies()).availableCopies(b.getAvailableCopies()).build();
    }

    private Book toEntity(BookDTO d) {
        return Book.builder().id(d.getId()).title(d.getTitle()).author(d.getAuthor())
                .isbn(d.getIsbn()).publicationYear(d.getPublicationYear())
                .totalCopies(d.getTotalCopies()).availableCopies(d.getAvailableCopies()).build();
    }
}
