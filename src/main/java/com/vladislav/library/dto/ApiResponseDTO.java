package com.vladislav.library.dto;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class ApiResponseDTO<T> {

    private String message;

    private T data;

    private boolean success;

    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return ApiResponseDTO.<T>builder()
                .message(message).data(data).success(true).build();
    }

    public static <T> ApiResponseDTO<T> error(String message) {
        return ApiResponseDTO.<T>builder()
                .message(message).success(false).build();
    }
}
