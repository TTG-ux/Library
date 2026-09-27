package com.vladislav.library.actuator;

import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

@Component
public class CustomInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("library", java.util.Map.of(
                "name", "Library Management System",
                "version", "2.0.0",
                "features", java.util.List.of("JWT Auth", "Book Management", "Reader Management", "Loan Tracking")
        ));
    }
}
