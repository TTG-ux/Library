package com.vladislav.library.exception;

// 409
public class BookAlreadyLoanedException extends RuntimeException {

    public BookAlreadyLoanedException(Long bookId) {
        super("Книга с ID " + bookId + " уже выдана читателю");
    }
}
