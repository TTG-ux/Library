package com.vladislav.library.exception;

// 409
public class DuplicateIsbnException extends  RuntimeException {

    public DuplicateIsbnException(String isbn) {
        super("Книга с ISBN " + isbn + " уже существует в системе");
    }
}
