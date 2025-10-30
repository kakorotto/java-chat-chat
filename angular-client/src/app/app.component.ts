import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/login">Login</a>
      <a routerLink="/register">Register</a>
      <a routerLink="/chat">Chat</a>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}


