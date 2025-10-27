package com.chatapp.chat.repository;

import com.chatapp.chat.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByIsPrivateFalse();
    List<ChatRoom> findByCreatedBy(Long createdBy);
}
