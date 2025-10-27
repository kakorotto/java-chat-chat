# Use OpenJDK 11 as base image
FROM openjdk:11-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/eureka-server-1.0.0.jar app.jar

# Expose port
EXPOSE 8761

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
