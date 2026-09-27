package com.vladislav.library.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Table(name = "books")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Название книги обязательно")
    private String title;

    @NotBlank(message = "У книги должен быть автор")
    private String author;

    @NotBlank(message = "ISBN обязателен")
    @Pattern(regexp = "^(\\d{10}|\\d{13})$", message = "ISBN должен содержать 10 или 13 цифр")
    @Column(unique = true)
    private String isbn;

    @Min(value = 1800, message = "Год издания должен быть больше 1800")
    @Column(name = "publication_year")
    private Integer publicationYear;

    @Min(value = 1, message = "Общее количесво должно быть >=1")
    @Column(name = "total_copies")
    private Integer totalCopies;

    @Min(value = 0, message = "Доступные экзепляры не могут быть отрицательными")
    @Column(name = "available_copies")
    private Integer availableCopies;
}
