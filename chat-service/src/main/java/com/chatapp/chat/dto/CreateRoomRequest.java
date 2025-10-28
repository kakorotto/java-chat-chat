package com.chatapp.chat.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreateRoomRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    private boolean isPrivate = false;
    private Integer maxMembers;

    // Constructors
    public CreateRoomRequest() {}

    public CreateRoomRequest(String name, String description, boolean isPrivate, Integer maxMembers) {
        this.name = name;
        this.description = description;
        this.isPrivate = isPrivate;
        this.maxMembers = maxMembers;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isPrivate() { return isPrivate; }
    public void setPrivate(boolean isPrivate) { this.isPrivate = isPrivate; }

    public Integer getMaxMembers() { return maxMembers; }
    public void setMaxMembers(Integer maxMembers) { this.maxMembers = maxMembers; }
}
