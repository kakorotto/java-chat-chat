import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

// Use dynamic imports for WebSocket to avoid initialization errors
let SockJS: any;
let Client: any;
type IMessage = any;

export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdBy: number;
  createdAt: string;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  roomId: number;
  type: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient: any = null; // Use any since Client is loaded dynamically
  private roomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  private messagesSubject = new BehaviorSubject<Map<number, Message[]>>(new Map());
  private currentRoomId: number | null = null;
  private userId: number | null = null;

  public rooms$ = this.roomsSubject.asObservable();
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Get user ID from localStorage if available
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.userId = parseInt(savedUserId, 10);
    }
  }

  setUserId(userId: number) {
    this.userId = userId;
    localStorage.setItem('userId', userId.toString());
  }

  getUserId(): number | null {
    return this.userId;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-Id': this.userId?.toString() || '',
    });
  }

  async connectWebSocket() {
    if (this.stompClient?.connected) {
      return;
    }

    try {
      // Lazy load WebSocket libraries only when needed
      if (!SockJS || !Client) {
        const SockJSModule = await import('sockjs-client');
        const StompModule = await import('@stomp/stompjs');
        
        SockJS = SockJSModule.default || SockJSModule;
        Client = StompModule.Client || (StompModule as any).default?.Client || (StompModule as any).default;
        
        if (!SockJS || !Client) {
          console.warn('WebSocket libraries not available, skipping connection');
          return;
        }
      }

      // SockJS requires HTTP/HTTPS URL, not ws:// or wss://
      // Convert ws:// to http:// and wss:// to https://
      let wsUrl = environment.wsUrl;
      if (wsUrl.startsWith('ws://')) {
        wsUrl = wsUrl.replace('ws://', 'http://');
      } else if (wsUrl.startsWith('wss://')) {
        wsUrl = wsUrl.replace('wss://', 'https://');
      }

      // Skip WebSocket connection if URL is invalid (e.g., localhost from GitHub Pages)
      if (wsUrl.includes('localhost') && window.location.protocol === 'https:') {
        console.warn('Cannot connect to localhost WebSocket from HTTPS page. Skipping WebSocket connection.');
        return;
      }

      try {
        const socket = new SockJS(wsUrl);
        this.stompClient = new Client({
          webSocketFactory: () => socket as any,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log('WebSocket connected');
            this.loadRooms();
          },
          onStompError: (frame: any) => {
            console.error('WebSocket error:', frame);
          },
          onDisconnect: () => {
            console.log('WebSocket disconnected');
          },
        });

        this.stompClient.activate();
      } catch (socketError: any) {
        console.error('Failed to create SockJS connection:', socketError);
        // Don't throw - allow app to continue without WebSocket
      }
    } catch (error: any) {
      console.error('Failed to connect WebSocket:', error);
      // If it's a URL scheme error, it's likely because we're trying to use ws:// from HTTPS
      if (error?.message?.includes("scheme must be either 'http:' or 'https:'")) {
        console.warn('WebSocket URL scheme error. Ensure WS_URL uses http:// or https://, not ws:// or wss://');
      }
      // Don't throw - allow app to continue without WebSocket
    }
  }

  disconnectWebSocket() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  async loadRooms(): Promise<ChatRoom[]> {
    try {
      const rooms = await firstValueFrom(
        this.http.get<ChatRoom[]>(`${environment.apiBaseUrl}/chat/rooms/public`, {
          headers: this.getHeaders(),
        })
      );
      this.roomsSubject.next(rooms);
      return rooms;
    } catch (error) {
      console.error('Error loading rooms:', error);
      return [];
    }
  }

  async createRoom(name: string, description: string, isPrivate: boolean): Promise<ChatRoom | null> {
    try {
      const room = await firstValueFrom(
        this.http.post<ChatRoom>(
          `${environment.apiBaseUrl}/chat/rooms`,
          { name, description, isPrivate },
          { headers: this.getHeaders() }
        )
      );
      await this.loadRooms(); // Refresh room list
      return room;
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  }

  async joinRoom(roomId: number): Promise<boolean> {
    if (!this.userId) return false;

    try {
      const response = await firstValueFrom(
        this.http.post<string>(
          `${environment.apiBaseUrl}/chat/rooms/${roomId}/join`,
          {},
          { headers: this.getHeaders() }
        )
      );

      this.currentRoomId = roomId;

      // Subscribe to room messages via WebSocket
      if (this.stompClient?.connected) {
        this.stompClient.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
          const messageData: Message = JSON.parse(message.body);
          this.addMessageToRoom(roomId, messageData);
        });
      }

      // Load existing messages
      await this.loadRoomMessages(roomId);

      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  }

  async loadRoomMessages(roomId: number): Promise<Message[]> {
    try {
      const messages = await firstValueFrom(
        this.http.get<Message[]>(`${environment.apiBaseUrl}/chat/rooms/${roomId}/messages`, {
          headers: this.getHeaders(),
        })
      );
      
      const messagesMap = this.messagesSubject.value;
      messagesMap.set(roomId, messages);
      this.messagesSubject.next(new Map(messagesMap));
      
      return messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  private addMessageToRoom(roomId: number, message: Message) {
    const messagesMap = this.messagesSubject.value;
    const roomMessages = messagesMap.get(roomId) || [];
    roomMessages.push(message);
    messagesMap.set(roomId, roomMessages);
    this.messagesSubject.next(new Map(messagesMap));
  }

  async sendMessage(content: string, roomId: number): Promise<boolean> {
    if (!this.userId) return false;

    try {
      await firstValueFrom(
        this.http.post<Message>(
          `${environment.apiBaseUrl}/chat/messages`,
          { content, roomId, type: 'TEXT' },
          { headers: this.getHeaders() }
        )
      );
      // Message will be received via WebSocket and added automatically
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  getMessagesForRoom(roomId: number): Message[] {
    return this.messagesSubject.value.get(roomId) || [];
  }

  getCurrentRoomId(): number | null {
    return this.currentRoomId;
  }
}

