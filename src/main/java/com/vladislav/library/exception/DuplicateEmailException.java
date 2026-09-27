package com.vladislav.library.exception;

// 409
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("Читатель с email " + email + " уже зарегистрирован");
    }
}
