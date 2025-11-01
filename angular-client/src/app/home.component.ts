import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-home',
  template: `
    <div style="padding: 20px;">
      <h1>Welcome to Java Chat SaaS</h1>
      <p>Angular front-end connected to Spring Boot APIs.</p>
      <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
        <h3>API Configuration</h3>
        <p><strong>API Base URL:</strong> {{ apiUrl }}</p>
        <p><strong>WebSocket URL:</strong> {{ wsUrl }}</p>
        <p *ngIf="isLocalhost" style="color: orange; margin-top: 10px;">
          ⚠️ Using localhost URLs. For production, set API_BASE_URL and WS_URL in GitHub Actions variables.
        </p>
        <div *ngIf="isLocalhost" style="margin-top: 10px; font-size: 0.9em;">
          <p>To configure production API:</p>
          <ol style="text-align: left; display: inline-block;">
            <li>Go to GitHub repo Settings → Secrets and variables → Actions → Variables</li>
            <li>Add <code>API_BASE_URL</code> (e.g., https://your-api.com/api)</li>
            <li>Add <code>WS_URL</code> (e.g., wss://your-api.com/ws)</li>
            <li>Redeploy the workflow</li>
          </ol>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <a routerLink="/login" style="margin-right: 10px; padding: 10px 20px; background: #2196f3; color: white; text-decoration: none; border-radius: 4px;">Login</a>
        <a routerLink="/register" style="margin-right: 10px; padding: 10px 20px; background: #4caf50; color: white; text-decoration: none; border-radius: 4px;">Register</a>
        <a routerLink="/chat" style="padding: 10px 20px; background: #ff9800; color: white; text-decoration: none; border-radius: 4px;">Chat</a>
      </div>
    </div>
  `,
})
export class HomeComponent {
  apiUrl = environment.apiBaseUrl;
  wsUrl = environment.wsUrl;
  isLocalhost = environment.apiBaseUrl.includes('localhost');
}


