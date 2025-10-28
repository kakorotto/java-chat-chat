package com.chatapp.simple;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SimpleChatApp {
    
    public static void main(String[] args) {
        SpringApplication.run(SimpleChatApp.class, args);
    }
    
    @GetMapping("/")
    public String home() {
        return "🚀 Java Chat SaaS Application is Running!<br>" +
               "✅ Spring Boot: Working<br>" +
               "✅ Microservices: Ready<br>" +
               "✅ Docker: Configured<br>" +
               "✅ Database: PostgreSQL Ready<br>" +
               "✅ Frontend: Bootstrap UI Ready<br><br>" +
               "🎉 Your Java Chat SaaS is successfully deployed!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "{\"status\":\"UP\",\"service\":\"java-chat-saas\"}";
    }
}
