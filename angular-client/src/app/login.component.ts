import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-login',
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="username" name="username" placeholder="Username" required />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p *ngIf="error" style="color:red">{{ error }}</p>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.error = '';
    try {
      await this.auth.login(this.username, this.password);
      this.router.navigateByUrl('/chat');
    } catch (e: any) {
      // CORS disabled - simplified error handling
      // Silently handle CORS errors (status 0 or network errors)
      if (e?.status === 0 || e?.message?.includes('CORS') || e?.message?.includes('Failed to fetch')) {
        // CORS errors are handled silently - show generic error
        this.error = e?.error?.message || e?.error || 'Login failed. Please check your connection.';
      } else {
        this.error = e?.error?.message || e?.error || 'Login failed';
      }
    }
  }
}


