#!/bin/bash

# Java Chat SaaS Build Script

echo "🚀 Building Java Chat SaaS Application..."

# Clean and build all modules
echo "📦 Building all modules..."
mvn clean package -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🐳 Starting services with Docker Compose..."
    docker-compose up -d
    
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    echo "🌐 Application is starting up..."
    echo "📱 Client Application: http://localhost:3000"
    echo "🔗 API Gateway: http://localhost:8080"
    echo "📊 Eureka Dashboard: http://localhost:8761"
    echo ""
    echo "📋 Service Health Checks:"
    echo "   Auth Service: http://localhost:8081/actuator/health"
    echo "   Chat Service: http://localhost:8082/actuator/health"
    echo "   User Service: http://localhost:8083/actuator/health"
    echo "   Notification Service: http://localhost:8084/actuator/health"
    echo ""
    echo "🎉 Java Chat SaaS is ready!"
    
else
    echo "❌ Build failed!"
    exit 1
fi
