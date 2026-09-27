package com.vladislav.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoanRequestDTO {

    @NotNull(message = "ID книги обязателен")
    private Long bookId;

    @NotNull(message = "ID читателя обязателен")
    private Long readerId;

    @NotNull(message = "Срок возврата обязателен")
    private LocalDate dueDate;
}
