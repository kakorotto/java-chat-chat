# Multi-stage build
FROM openjdk:11-jdk-slim as builder

# Set working directory
WORKDIR /app

# Copy entire project structure
COPY . .

# Download dependencies
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
RUN mvn dependency:go-offline -B

# Build the application
RUN mvn clean package -DskipTests -pl auth-service

# Runtime stage
FROM openjdk:11-jre-slim

WORKDIR /app

# Copy the JAR file from builder stage
COPY --from=builder /app/auth-service/target/auth-service-1.0.0.jar app.jar

# Expose port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
