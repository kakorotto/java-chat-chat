# Use OpenJDK 11 as base image
FROM openjdk:11-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/auth-service-1.0.0.jar app.jar

# Expose port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
