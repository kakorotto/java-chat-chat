package com.chatapp.chat.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SendMessageRequest {
    @NotBlank
    @Size(max = 1000)
    private String content;

    private Long roomId;
    private String type = "TEXT";

    // Constructors
    public SendMessageRequest() {}

    public SendMessageRequest(String content, Long roomId) {
        this.content = content;
        this.roomId = roomId;
    }

    // Getters and Setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
