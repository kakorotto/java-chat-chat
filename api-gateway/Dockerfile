FROM openjdk:11-jdk-slim

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Expose port
EXPOSE 8080

# Run with Maven directly
CMD ["mvn", "spring-boot:run", "-pl", "api-gateway", "-Dspring-boot.run.arguments=--server.port=8080"]
