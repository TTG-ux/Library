package com.vladislav.library.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

@Configuration
@EnableRetry
public class Retry {
    // Spring Retry включён через @EnableRetry
    // Использование: @Retryable на методах сервисов
}
