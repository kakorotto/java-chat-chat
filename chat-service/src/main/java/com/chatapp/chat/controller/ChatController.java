package com.chatapp.chat.controller;

import com.chatapp.chat.dto.CreateRoomRequest;
import com.chatapp.chat.dto.SendMessageRequest;
import com.chatapp.chat.model.ChatRoom;
import com.chatapp.chat.model.Message;
import com.chatapp.chat.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/rooms")
    public ResponseEntity<ChatRoom> createRoom(@Valid @RequestBody CreateRoomRequest request,
                                               @RequestHeader("X-User-Id") Long userId) {
        ChatRoom room = chatService.createRoom(request, userId);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/rooms/public")
    public ResponseEntity<List<ChatRoom>> getPublicRooms() {
        List<ChatRoom> rooms = chatService.getPublicRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/rooms/user/{userId}")
    public ResponseEntity<List<ChatRoom>> getUserRooms(@PathVariable Long userId) {
        List<ChatRoom> rooms = chatService.getUserRooms(userId);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(@Valid @RequestBody SendMessageRequest request,
                                              @RequestHeader("X-User-Id") Long userId) {
        Message message = chatService.sendMessage(request, userId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<Message>> getRoomMessages(@PathVariable Long roomId) {
        List<Message> messages = chatService.getRoomMessages(roomId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/rooms/{roomId}/join")
    public ResponseEntity<String> joinRoom(@PathVariable Long roomId,
                                          @RequestHeader("X-User-Id") Long userId) {
        boolean success = chatService.joinRoom(roomId, userId);
        if (success) {
            return ResponseEntity.ok("Successfully joined room");
        } else {
            return ResponseEntity.badRequest().body("Already a member or room not found");
        }
    }

    @PostMapping("/rooms/{roomId}/leave")
    public ResponseEntity<String> leaveRoom(@PathVariable Long roomId,
                                           @RequestHeader("X-User-Id") Long userId) {
        boolean success = chatService.leaveRoom(roomId, userId);
        if (success) {
            return ResponseEntity.ok("Successfully left room");
        } else {
            return ResponseEntity.badRequest().body("Not a member of this room");
        }
    }
}
