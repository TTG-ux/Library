# STAGE 1: Build
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Копируем pom.xml и скачиваем зависимости (кэширование)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Копируем исходный код и собираем проект
COPY src ./src
RUN mvn clean package -DskipTests -B


# STAGE 2: Runtime
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Создаём непривилегированного пользователя
RUN groupadd -r library && useradd -r -g library library

# Копируем собранный jar
COPY --from=builder /app/target/*.jar app.jar

# Создаём директорию для данных
RUN mkdir -p /app/data && chown -R library:library /app

# Переключаемся на непривилегированного пользователя
USER library

# Переменные окружения
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+UseStringDeduplication"
ENV SPRING_PROFILES_ACTIVE=prod

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]