package com.vladislav.library.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsDTO {
    private long totalBooks;
    private long availableBooks;
    private long totalReaders;
    private long activeLoans;
    private long overdueLoans;
}
