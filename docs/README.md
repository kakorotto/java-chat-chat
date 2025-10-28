# Java Chat SaaS - GitHub Pages Demo

This is a **static frontend demo** of the Java Chat SaaS application deployed on GitHub Pages.

## 🌐 Live Demo

**Frontend**: https://kakorotto.github.io/java-chat-chat/

## 🚀 Full Application

To run the complete application with backend services:

### Docker (Recommended)
```bash
git clone https://github.com/kakorotto/java-chat-chat.git
cd java-chat-chat
docker compose up -d
```

### Local Development
```bash
# Install Maven
wget https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
tar -xzf apache-maven-3.9.6-bin.tar.gz
export PATH=$PATH:$(pwd)/apache-maven-3.9.6/bin

# Start databases
docker compose up postgres-auth postgres-chat postgres-users postgres-notifications redis -d

# Start services (in separate terminals)
cd eureka-server && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
cd auth-service && mvn spring-boot:run
cd chat-service && mvn spring-boot:run
cd user-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd client-app && mvn spring-boot:run
```

## 📱 Access Points

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

## 🏗️ Architecture

- **Frontend**: Spring Boot + Thymeleaf + Bootstrap
- **Backend**: Spring Boot Microservices
- **Service Discovery**: Eureka Server
- **API Gateway**: Spring Cloud Gateway
- **Database**: PostgreSQL (4 instances)
- **Caching**: Redis
- **Authentication**: JWT + CSRF
- **Real-time**: WebSocket + STOMP

## 🔧 Features

- ✅ User Registration & Login
- ✅ Real-time Chat
- ✅ Chat Rooms (Public/Private)
- ✅ Microservices Architecture
- ✅ Docker Containerization
- ✅ CSRF Protection
- ✅ JWT Authentication
- ✅ Service Discovery
- ✅ API Gateway

## 📋 Services

1. **Eureka Server** (8761) - Service Discovery
2. **API Gateway** (8080) - Centralized Routing
3. **Auth Service** (8081) - Authentication & Authorization
4. **Chat Service** (8082) - Chat & Messaging
5. **User Service** (8083) - User Management
6. **Notification Service** (8084) - Notifications
7. **Client App** (3000) - Frontend Application

## 🚀 Deployment Options

- **Docker Compose**: Local development
- **Kubernetes**: Production deployment
- **Cloud Platforms**: AWS, Azure, GCP
- **GitHub Pages**: Static frontend demo

## 📝 Notes

- The GitHub Pages version is a **static demo** with mock functionality
- For full functionality, deploy the complete microservices stack
- Update the `API_BASE_URL` in the static version to point to your deployed backend
