package com.chatapp.chat.repository;

import com.chatapp.chat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoomIdOrderByCreatedAtAsc(Long roomId);
    List<Message> findByRoomIdAndCreatedAtAfterOrderByCreatedAtAsc(Long roomId, java.time.LocalDateTime after);
}
