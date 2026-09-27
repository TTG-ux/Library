package com.vladislav.library.exception;

// 400
public class BookAlreadyReturnedException extends RuntimeException {

    public BookAlreadyReturnedException(Long loanId) {
        super("Запись о выдаче с ID " + loanId + " уже имеет статус 'возвращена'");
    }
}
