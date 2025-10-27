# Java Chat SaaS Application

A modern, scalable chat application built with Spring Boot microservices architecture, designed for SaaS deployment with Docker containerization.

## 🏗️ Architecture

This application follows a microservices architecture with the following components:

- **Eureka Server** (Port 8761) - Service discovery and registration
- **API Gateway** (Port 8080) - Central entry point for all client requests
- **Auth Service** (Port 8081) - JWT-based authentication and user management
- **Chat Service** (Port 8082) - Real-time messaging with WebSocket support
- **User Service** (Port 8083) - User profile management
- **Notification Service** (Port 8084) - Push notifications and alerts
- **Client App** (Port 3000) - Frontend web application

## 🚀 Features

- **Real-time Chat**: WebSocket-powered instant messaging
- **Microservices Architecture**: Scalable and maintainable service-oriented design
- **JWT Authentication**: Secure token-based authentication
- **Docker Support**: Complete containerization for easy deployment
- **PostgreSQL Databases**: Separate databases for each service
- **Redis Caching**: Session management and caching
- **Service Discovery**: Eureka-based service registration
- **API Gateway**: Centralized routing and load balancing
- **Modern UI**: Bootstrap-based responsive frontend

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.2.0, Spring Cloud 2023.0.0
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **WebSocket**: SockJS, STOMP
- **Containerization**: Docker, Docker Compose
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd java-chat-chat
```

### 2. Build the Application

```bash
mvn clean package -DskipTests
```

### 3. Start with Docker Compose

```bash
docker-compose up -d
```

This will start all services including:

- PostgreSQL databases for each service
- Redis for caching
- Eureka Server for service discovery
- All microservices
- The client application

### 4. Access the Application

- **Client Application**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Service Health Checks**:
  - Auth Service: http://localhost:8081/actuator/health
  - Chat Service: http://localhost:8082/actuator/health
  - User Service: http://localhost:8083/actuator/health
  - Notification Service: http://localhost:8084/actuator/health

## 🔧 Development Setup

### Manual Service Startup

If you prefer to run services individually:

1. **Start Eureka Server**:

   ```bash
   cd eureka-server
   mvn spring-boot:run
   ```

2. **Start Database Services**:

   ```bash
   docker-compose up postgres-auth postgres-chat postgres-users postgres-notifications redis -d
   ```

3. **Start Microservices** (in separate terminals):

   ```bash
   # Auth Service
   cd auth-service && mvn spring-boot:run

   # Chat Service
   cd chat-service && mvn spring-boot:run

   # User Service
   cd user-service && mvn spring-boot:run

   # Notification Service
   cd notification-service && mvn spring-boot:run

   # API Gateway
   cd api-gateway && mvn spring-boot:run

   # Client App
   cd client-app && mvn spring-boot:run
   ```

## 📊 API Endpoints

### Authentication Service (via API Gateway)

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Chat Service (via API Gateway)

- `GET /api/chat/rooms/public` - Get public chat rooms
- `POST /api/chat/rooms` - Create new chat room
- `POST /api/chat/rooms/{roomId}/join` - Join a chat room
- `POST /api/chat/rooms/{roomId}/leave` - Leave a chat room
- `GET /api/chat/rooms/{roomId}/messages` - Get room messages
- `POST /api/chat/messages` - Send a message

### User Service (via API Gateway)

- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update user profile
- `GET /api/users/online` - Get online users
- `GET /api/users/search?username={name}` - Search users

### Notification Service (via API Gateway)

- `GET /api/notifications/user/{userId}` - Get user notifications
- `GET /api/notifications/user/{userId}/unread` - Get unread notifications
- `POST /api/notifications/{notificationId}/read` - Mark notification as read

## 🐳 Docker Configuration

Each service has its own Dockerfile for containerization. The `docker-compose.yml` file orchestrates all services with:

- **Separate PostgreSQL instances** for each service
- **Redis** for caching and session management
- **Network isolation** with custom Docker network
- **Volume persistence** for database data
- **Environment variables** for configuration

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Cross-origin resource sharing setup
- **Password Encryption**: BCrypt password hashing
- **Input Validation**: Request validation using Bean Validation
- **SQL Injection Protection**: JPA/Hibernate ORM protection

## 📈 Monitoring

All services include Spring Boot Actuator for monitoring:

- Health checks at `/actuator/health`
- Metrics at `/actuator/metrics`
- Application info at `/actuator/info`

## 🌐 WebSocket Support

Real-time chat functionality using:

- **SockJS** for WebSocket fallback support
- **STOMP** protocol for message routing
- **Spring WebSocket** configuration
- **Room-based messaging** with topic subscriptions

## 🚀 SaaS Deployment

This application is designed for SaaS deployment with:

- **Microservices Architecture**: Independent scaling of services
- **Containerization**: Easy deployment and scaling with Docker
- **Service Discovery**: Dynamic service registration and discovery
- **API Gateway**: Centralized routing and load balancing
- **Database Separation**: Isolated data storage per service
- **Monitoring**: Built-in health checks and metrics

## 📝 Usage

1. **Register**: Create a new account at http://localhost:3000/register
2. **Login**: Sign in with your credentials
3. **Create Room**: Create a new chat room or join existing ones
4. **Chat**: Start real-time messaging with other users
5. **Manage Profile**: Update your user profile and settings

## 🔧 Configuration

Key configuration files:

- `application.yml` in each service for service-specific settings
- `docker-compose.yml` for container orchestration
- `pom.xml` for Maven dependencies and build configuration

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
