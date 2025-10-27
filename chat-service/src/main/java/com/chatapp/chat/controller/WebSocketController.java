package com.chatapp.chat.controller;

import com.chatapp.chat.dto.SendMessageRequest;
import com.chatapp.chat.model.Message;
import com.chatapp.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/send.message")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@Payload SendMessageRequest request) {
        // Note: In a real implementation, you'd need to extract user ID from the WebSocket session
        // For now, we'll use a placeholder
        Long userId = 1L; // This should be extracted from JWT token in WebSocket session
        
        return chatService.sendMessage(request, userId);
    }
}
