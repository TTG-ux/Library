package com.vladislav.library.exception;

// 400
public class InvalidDataException extends RuntimeException {
    public InvalidDataException(String message) { super(message);}
}
