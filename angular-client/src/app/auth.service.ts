import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  async getCsrf(): Promise<string | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ token?: string }>(`${environment.apiBaseUrl}/auth/csrf`, {
          withCredentials: true,
        })
      );
      this.csrfToken = res.token ?? null;
      return this.csrfToken;
    } catch {
      return null;
    }
  }

  async login(username: string, password: string) {
    await this.getCsrf();
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': this.csrfToken || '',
    });
    const response = await firstValueFrom(
      this.http.post<any>(
        `${environment.apiBaseUrl}/auth/signin`,
        { username, password },
        { headers, withCredentials: true }
      )
    );
    
    // Store user info if available
    if (response.userId || response.id) {
      localStorage.setItem('userId', (response.userId || response.id).toString());
    }
    
    return response;
  }

  async register(username: string, email: string, password: string) {
    await this.getCsrf();
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': this.csrfToken || '',
    });
    return firstValueFrom(
      this.http.post<any>(
        `${environment.apiBaseUrl}/auth/signup`,
        { username, email, password },
        { headers, withCredentials: true }
      )
    );
  }
}


