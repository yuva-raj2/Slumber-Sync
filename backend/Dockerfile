# Stage 1: Build JAR using Maven and Java 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal, secure JRE 17 runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
VOLUME /tmp

RUN addgroup -S slumber && adduser -S slumber -G slumber
USER slumber:slumber

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
