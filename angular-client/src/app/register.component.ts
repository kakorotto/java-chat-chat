import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-register',
  template: `
    <h2>Register</h2>
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="username" name="username" placeholder="Username" required />
      <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p *ngIf="message" style="color:green">{{ message }}</p>
    <p *ngIf="error" style="color:red">{{ error }}</p>
  `,
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  message = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.error = '';
    this.message = '';
    try {
      await this.auth.register(this.username, this.email, this.password);
      this.message = 'Registration successful! Please login.';
      setTimeout(() => this.router.navigateByUrl('/login'), 800);
    } catch (e: any) {
      this.error = e?.error || 'Registration failed';
    }
  }
}


