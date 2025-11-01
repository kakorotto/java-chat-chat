import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatRoom, Message } from './chat.service';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <nav class="chat-nav">
        <h3>Java Chat SaaS</h3>
        <div class="user-info">
          <span>User ID: {{ userId || 'Not set' }}</span>
          <button (click)="logout()">Logout</button>
        </div>
      </nav>

      <div class="chat-main">
        <!-- Sidebar: Room List -->
        <div class="sidebar">
          <div class="sidebar-header">
            <h4>Chat Rooms</h4>
            <button (click)="showCreateModal = true" class="btn-primary btn-sm">
              Create Room
            </button>
          </div>
          <div class="room-list">
            <div
              *ngFor="let room of rooms"
              class="room-item"
              [class.active]="currentRoomId === room.id"
              (click)="joinRoom(room.id)"
            >
              <div class="room-name">{{ room.name }}</div>
              <div class="room-desc">{{ room.description || 'No description' }}</div>
            </div>
            <div *ngIf="rooms.length === 0" class="empty-state">
              No rooms available. Create one!
            </div>
          </div>
        </div>

        <!-- Main Chat Area -->
        <div class="chat-area">
          <div class="chat-header">
            <h4>{{ currentRoomName || 'Select a room to start chatting' }}</h4>
          </div>
          <div class="messages-container" #messagesContainer>
            <div
              *ngFor="let message of currentMessages"
              class="message"
              [class.own-message]="message.senderId === userId"
            >
              <div class="message-header">
                <span>{{ message.senderId === userId ? 'You' : 'User ' + message.senderId }}</span>
                <span class="message-time">{{ formatTime(message.createdAt) }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
            <div *ngIf="currentMessages.length === 0 && currentRoomId" class="empty-state">
              No messages yet. Start the conversation!
            </div>
          </div>
          <div class="message-input-area">
            <input
              [(ngModel)]="messageText"
              (keydown.enter)="sendMessage()"
              [disabled]="!currentRoomId"
              placeholder="Type your message..."
              class="message-input"
            />
            <button
              (click)="sendMessage()"
              [disabled]="!currentRoomId || !messageText.trim()"
              class="btn-primary"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <!-- Create Room Modal -->
      <div *ngIf="showCreateModal" class="modal-overlay" (click)="showCreateModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Create New Room</h3>
            <button (click)="showCreateModal = false" class="close-btn">&times;</button>
          </div>
          <form (ngSubmit)="createRoom()" class="modal-body">
            <div class="form-group">
              <label>Room Name</label>
              <input [(ngModel)]="newRoomName" name="roomName" required class="form-control" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea
                [(ngModel)]="newRoomDescription"
                name="description"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="newRoomIsPrivate"
                  name="isPrivate"
                />
                Private Room
              </label>
            </div>
            <div class="modal-footer">
              <button type="button" (click)="showCreateModal = false" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn-primary">Create Room</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .chat-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #f5f5f5;
      }

      .chat-nav {
        background: #2196f3;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-nav h3 {
        margin: 0;
      }

      .user-info {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .chat-main {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .sidebar {
        width: 300px;
        background: white;
        border-right: 1px solid #ddd;
        display: flex;
        flex-direction: column;
      }

      .sidebar-header {
        padding: 1rem;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sidebar-header h4 {
        margin: 0;
      }

      .room-list {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
      }

      .room-item {
        padding: 1rem;
        margin-bottom: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .room-item:hover {
        background: #f0f0f0;
      }

      .room-item.active {
        background: #e3f2fd;
        border-color: #2196f3;
      }

      .room-name {
        font-weight: bold;
        margin-bottom: 0.25rem;
      }

      .room-desc {
        font-size: 0.875rem;
        color: #666;
      }

      .chat-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: white;
      }

      .chat-header {
        padding: 1rem;
        border-bottom: 1px solid #ddd;
      }

      .chat-header h4 {
        margin: 0;
      }

      .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .message {
        padding: 0.75rem;
        border-radius: 4px;
        background: #f0f0f0;
        max-width: 70%;
      }

      .message.own-message {
        background: #2196f3;
        color: white;
        align-self: flex-end;
      }

      .message-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
        opacity: 0.8;
      }

      .message-content {
        word-wrap: break-word;
      }

      .message-input-area {
        padding: 1rem;
        border-top: 1px solid #ddd;
        display: flex;
        gap: 0.5rem;
      }

      .message-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-header {
        padding: 1rem;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
      }

      .modal-body {
        padding: 1rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }

      .form-control {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .btn-primary,
      .btn-secondary {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }

      .btn-primary {
        background: #2196f3;
        color: white;
      }

      .btn-primary:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .btn-primary:hover:not(:disabled) {
        background: #1976d2;
      }

      .btn-secondary {
        background: #ccc;
        color: black;
      }

      .btn-secondary:hover {
        background: #aaa;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
      }

      .empty-state {
        text-align: center;
        padding: 2rem;
        color: #999;
      }
    `,
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  rooms: ChatRoom[] = [];
  currentRoomId: number | null = null;
  currentRoomName: string = '';
  currentMessages: Message[] = [];
  messageText: string = '';
  userId: number | null = null;
  showCreateModal: boolean = false;
  newRoomName: string = '';
  newRoomDescription: string = '';
  newRoomIsPrivate: boolean = false;

  constructor(private chatService: ChatService, private authService: AuthService) {}

  async ngOnInit() {
    // Get user ID from localStorage or set a placeholder
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.userId = parseInt(savedUserId, 10);
      this.chatService.setUserId(this.userId);
    } else {
      // If no user ID, use a placeholder (in real app, get from auth service)
      this.userId = 1; // TODO: Get from actual auth response
      this.chatService.setUserId(this.userId);
    }

    // Connect WebSocket
    await this.chatService.connectWebSocket();

    // Subscribe to rooms
    this.chatService.rooms$.subscribe((rooms) => {
      this.rooms = rooms;
    });

    // Subscribe to messages
    this.chatService.messages$.subscribe((messagesMap) => {
      if (this.currentRoomId) {
        this.currentMessages = this.chatService.getMessagesForRoom(this.currentRoomId);
        // Scroll to bottom
        setTimeout(() => {
          const container = document.querySelector('.messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 0);
      }
    });
  }

  ngOnDestroy() {
    this.chatService.disconnectWebSocket();
  }

  async joinRoom(roomId: number) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return;

    const success = await this.chatService.joinRoom(roomId);
    if (success) {
      this.currentRoomId = roomId;
      this.currentRoomName = room.name;
      this.currentMessages = this.chatService.getMessagesForRoom(roomId);
    }
  }

  async sendMessage() {
    if (!this.currentRoomId || !this.messageText.trim()) return;

    const success = await this.chatService.sendMessage(this.messageText, this.currentRoomId);
    if (success) {
      this.messageText = '';
    }
  }

  async createRoom() {
    if (!this.newRoomName.trim()) return;

    const room = await this.chatService.createRoom(
      this.newRoomName,
      this.newRoomDescription,
      this.newRoomIsPrivate
    );

    if (room) {
      this.showCreateModal = false;
      this.newRoomName = '';
      this.newRoomDescription = '';
      this.newRoomIsPrivate = false;
    }
  }

  logout() {
    this.chatService.disconnectWebSocket();
    localStorage.removeItem('userId');
    window.location.href = '/login';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  }
}
