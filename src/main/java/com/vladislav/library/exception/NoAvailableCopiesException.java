package com.vladislav.library.exception;

// 400
public class NoAvailableCopiesException extends RuntimeException {

    public NoAvailableCopiesException(Long bookId) {
        super("Все экземпляры книги с ID " + bookId + " уже выданы");
    }
}
