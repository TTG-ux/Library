package com.vladislav.library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookDTO {

    private Long id;

    @NotBlank(message = "Название книги обязательно")
    private String title;

    @NotBlank(message = "Автор обязателен")
    private String author;

    @NotBlank(message = "ISBN обязателен")
    @Pattern(regexp = "^(\\d{10}|\\d{13})$", message = "ISBN: 10 или 13 цифр")
    private String isbn;

    @Min(value = 1800)
    private Integer publicationYear;

    @Min(value = 1)
    private Integer totalCopies;

    private Integer availableCopies;
}
