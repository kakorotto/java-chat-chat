import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  private getApiUrl(path: string): string {
    let baseUrl = environment.apiBaseUrl;
    
    // Validate API URL is configured
    if (!baseUrl || baseUrl.includes('{{') || baseUrl === '/' || baseUrl.trim() === '') {
      console.error('ERROR: API Base URL is not configured!', baseUrl);
      console.error('Please set API_BASE_URL in GitHub Actions variables or use localhost for development.');
      // Return empty string to fail fast - better than calling wrong URL
      return '';
    }
    
    // Remove trailing slash from base URL
    baseUrl = baseUrl.replace(/\/+$/, '');
    // Ensure path starts with /
    path = path.startsWith('/') ? path : '/' + path;
    
    return `${baseUrl}${path}`;
  }

  async getCsrf(): Promise<string | null> {
    // CSRF disabled for now - skip fetching CSRF token
    console.log('CSRF token fetching is disabled');
    return null;
  }

  async login(username: string, password: string) {
    // Skip CSRF for now
    // await this.getCsrf();
    
    const url = this.getApiUrl('/auth/signin');
    if (!url) {
      throw new Error('API URL not configured. Cannot login.');
    }
    
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // CSRF token header removed - disabled for now
      // 'X-CSRF-TOKEN': this.csrfToken || '',
    });
    // CORS disabled for now - removed withCredentials
    const response = await firstValueFrom(
      this.http.post<any>(
        url,
        { username, password },
        { headers }
      )
    );
    
    // Store user info if available
    if (response.userId || response.id) {
      localStorage.setItem('userId', (response.userId || response.id).toString());
    }
    
    return response;
  }

  async register(username: string, email: string, password: string) {
    // Skip CSRF for now
    // await this.getCsrf();
    
    const url = this.getApiUrl('/auth/signup');
    if (!url) {
      throw new Error('API URL not configured. Cannot register.');
    }
    
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // CSRF token header removed - disabled for now
      // 'X-CSRF-TOKEN': this.csrfToken || '',
    });
    // CORS disabled for now - removed withCredentials
    return firstValueFrom(
      this.http.post<any>(
        url,
        { username, email, password },
        { headers }
      )
    );
  }
}


