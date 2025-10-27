// Chat functionality
let stompClient = null;
let currentRoomId = null;

// WebSocket connection
function connectWebSocket() {
  const socket = new SockJS("http://localhost:8082/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    function (frame) {
      console.log("Connected: " + frame);
      loadRooms();
    },
    function (error) {
      console.log("WebSocket connection error: " + error);
    }
  );
}

// Load chat rooms
async function loadRooms() {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/rooms/public`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const rooms = await response.json();
      displayRooms(rooms);
    }
  } catch (error) {
    console.error("Error loading rooms:", error);
  }
}

// Display rooms in sidebar
function displayRooms(rooms) {
  const roomList = document.getElementById("roomList");
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const roomItem = document.createElement("div");
    roomItem.className = "room-item";
    roomItem.innerHTML = `
            <div><strong>${room.name}</strong></div>
            <div class="text-muted small">${
              room.description || "No description"
            }</div>
        `;
    roomItem.onclick = () => joinRoom(room.id, room.name);
    roomList.appendChild(roomItem);
  });
}

// Join a room
async function joinRoom(roomId, roomName) {
  try {
    // Join room via API
    const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-User-Id": currentUser.id,
      },
    });

    if (response.ok) {
      currentRoomId = roomId;
      document.getElementById("currentRoom").textContent = roomName;
      document.getElementById("messageInput").disabled = false;
      document.getElementById("sendButton").disabled = false;

      // Subscribe to room messages
      if (stompClient) {
        stompClient.subscribe(`/topic/room/${roomId}`, function (message) {
          const messageData = JSON.parse(message.body);
          displayMessage(messageData);
        });
      }

      // Load room messages
      loadRoomMessages(roomId);

      // Update active room in UI
      document.querySelectorAll(".room-item").forEach((item) => {
        item.classList.remove("active");
      });
      event.target.closest(".room-item").classList.add("active");
    }
  } catch (error) {
    console.error("Error joining room:", error);
  }
}

// Load room messages
async function loadRoomMessages(roomId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/chat/rooms/${roomId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.ok) {
      const messages = await response.json();
      displayMessages(messages);
    }
  } catch (error) {
    console.error("Error loading messages:", error);
  }
}

// Display messages
function displayMessages(messages) {
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = "";

  messages.forEach((message) => {
    displayMessage(message);
  });
}

// Display a single message
function displayMessage(message) {
  const messagesContainer = document.getElementById("messages");
  const messageDiv = document.createElement("div");

  const isOwnMessage = message.senderId === currentUser.id;
  messageDiv.className = `message ${isOwnMessage ? "own" : "other"}`;

  messageDiv.innerHTML = `
        <div class="message-header">${
          message.senderId === currentUser.id
            ? "You"
            : "User " + message.senderId
        }</div>
        <div class="message-content">${message.content}</div>
        <div class="message-time">${new Date(
          message.createdAt
        ).toLocaleTimeString()}</div>
    `;

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message
async function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const content = messageInput.value.trim();

  if (content && currentRoomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-User-Id": currentUser.id,
        },
        body: JSON.stringify({
          content: content,
          roomId: currentRoomId,
          type: "TEXT",
        }),
      });

      if (response.ok) {
        messageInput.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

// Create new room
async function createRoom() {
  const roomName = document.getElementById("roomName").value;
  const roomDescription = document.getElementById("roomDescription").value;
  const isPrivate = document.getElementById("isPrivate").checked;

  if (roomName) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-User-Id": currentUser.id,
        },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription,
          isPrivate: isPrivate,
        }),
      });

      if (response.ok) {
        // Close modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("createRoomModal")
        );
        modal.hide();

        // Clear form
        document.getElementById("roomName").value = "";
        document.getElementById("roomDescription").value = "";
        document.getElementById("isPrivate").checked = false;

        // Reload rooms
        loadRooms();
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }
}

// Initialize chat functionality
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname === "/chat" && checkAuth()) {
    connectWebSocket();

    // Send button event
    document
      .getElementById("sendButton")
      .addEventListener("click", sendMessage);

    // Enter key to send message
    document
      .getElementById("messageInput")
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          sendMessage();
        }
      });
  }
});
