package com.vladislav.library.actuator;


import lombok.RequiredArgsConstructor;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseHealthIndicator implements HealthIndicator {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Health health() {
        try {
            long startTime = System.currentTimeMillis();
            jdbcTemplate.execute("SELECT 1");
            long responseTime = System.currentTimeMillis() - startTime;

            if (responseTime > 1000) {
                return Health.down()
                        .withDetail("responseTime", responseTime + "ms")
                        .withDetail("status", "Медленный отклик")
                        .build();
            }

            return Health.up()
                    .withDetail("responseTime", responseTime + "ms")
                    .withDetail("status", "OK")
                    .build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
