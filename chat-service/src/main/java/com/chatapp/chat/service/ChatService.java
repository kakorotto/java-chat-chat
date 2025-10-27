package com.chatapp.chat.service;

import com.chatapp.chat.dto.CreateRoomRequest;
import com.chatapp.chat.dto.SendMessageRequest;
import com.chatapp.chat.model.ChatRoom;
import com.chatapp.chat.model.Message;
import com.chatapp.chat.model.RoomMember;
import com.chatapp.chat.repository.ChatRoomRepository;
import com.chatapp.chat.repository.MessageRepository;
import com.chatapp.chat.repository.RoomMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private RoomMemberRepository roomMemberRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatRoom createRoom(CreateRoomRequest request, Long userId) {
        ChatRoom room = new ChatRoom();
        room.setName(request.getName());
        room.setDescription(request.getDescription());
        room.setCreatedBy(userId);
        room.setPrivate(request.isPrivate());
        room.setMaxMembers(request.getMaxMembers());

        ChatRoom savedRoom = chatRoomRepository.save(room);

        // Add creator as admin
        RoomMember admin = new RoomMember(savedRoom.getId(), userId, RoomMember.MemberRole.ADMIN);
        roomMemberRepository.save(admin);

        return savedRoom;
    }

    public List<ChatRoom> getPublicRooms() {
        return chatRoomRepository.findByIsPrivateFalse();
    }

    public List<ChatRoom> getUserRooms(Long userId) {
        List<RoomMember> memberships = roomMemberRepository.findByUserId(userId);
        return memberships.stream()
                .map(member -> chatRoomRepository.findById(member.getRoomId()).orElse(null))
                .filter(room -> room != null)
                .toList();
    }

    public Message sendMessage(SendMessageRequest request, Long userId) {
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSenderId(userId);
        message.setRoomId(request.getRoomId());
        message.setType(Message.MessageType.valueOf(request.getType()));

        Message savedMessage = messageRepository.save(message);

        // Send to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/room/" + request.getRoomId(), savedMessage);

        return savedMessage;
    }

    public List<Message> getRoomMessages(Long roomId) {
        return messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
    }

    public boolean joinRoom(Long roomId, Long userId) {
        if (roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            return false; // Already a member
        }

        RoomMember member = new RoomMember(roomId, userId, RoomMember.MemberRole.MEMBER);
        roomMemberRepository.save(member);
        return true;
    }

    public boolean leaveRoom(Long roomId, Long userId) {
        Optional<RoomMember> member = roomMemberRepository.findByRoomIdAndUserId(roomId, userId);
        if (member.isPresent()) {
            roomMemberRepository.delete(member.get());
            return true;
        }
        return false;
    }
}
