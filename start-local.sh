#!/bin/bash

# Java Chat SaaS - Local Development Startup Script
echo "🚀 Starting Java Chat SaaS locally..."

# Set Maven path
export PATH=$PATH:$(pwd)/apache-maven-3.9.6/bin

# Check if Maven is available
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven first."
    exit 1
fi

echo "✅ Maven found: $(mvn -version | head -1)"

# Check if databases are running
echo "🔍 Checking databases..."
docker compose ps | grep postgres > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Databases are running"
else
    echo "❌ Databases not running. Starting them..."
    docker compose up postgres-auth postgres-chat postgres-users postgres-notifications redis -d
    echo "⏳ Waiting for databases to start..."
    sleep 10
fi

echo ""
echo "🎯 To start each service, open a new terminal and run:"
echo ""
echo "1️⃣ Eureka Server (Service Discovery):"
echo "   cd eureka-server && mvn spring-boot:run"
echo ""
echo "2️⃣ API Gateway (Port 8080):"
echo "   cd api-gateway && mvn spring-boot:run"
echo ""
echo "3️⃣ Auth Service (Port 8081):"
echo "   cd auth-service && mvn spring-boot:run"
echo ""
echo "4️⃣ Chat Service (Port 8082):"
echo "   cd chat-service && mvn spring-boot:run"
echo ""
echo "5️⃣ User Service (Port 8083):"
echo "   cd user-service && mvn spring-boot:run"
echo ""
echo "6️⃣ Notification Service (Port 8084):"
echo "   cd notification-service && mvn spring-boot:run"
echo ""
echo "7️⃣ Client App (Frontend - Port 3000):"
echo "   cd client-app && mvn spring-boot:run"
echo ""
echo "📱 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   API Gateway: http://localhost:8080"
echo "   Eureka Dashboard: http://localhost:8761"
echo ""
echo "⚠️  Start services in order: Eureka → API Gateway → Other Services → Client App"
