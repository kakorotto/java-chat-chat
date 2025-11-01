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
    const url = this.getApiUrl('/auth/csrf');
    if (!url) {
      console.error('Cannot fetch CSRF: API URL not configured');
      return null;
    }
    
    try {
      const res = await firstValueFrom(
        this.http.get<{ token?: string }>(url, {
          withCredentials: true,
        })
      );
      this.csrfToken = res.token ?? null;
      return this.csrfToken;
    } catch (error: any) {
      console.error('CSRF fetch error:', error);
      // If it's a CORS error, it means the backend isn't accessible
      if (error?.message?.includes('CORS') || error?.status === 0) {
        console.warn('Backend API not accessible. Check if API is running and CORS is configured.');
      }
      return null;
    }
  }

  async login(username: string, password: string) {
    await this.getCsrf();
    const url = this.getApiUrl('/auth/signin');
    if (!url) {
      throw new Error('API URL not configured. Cannot login.');
    }
    
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': this.csrfToken || '',
    });
    const response = await firstValueFrom(
      this.http.post<any>(
        url,
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
    const url = this.getApiUrl('/auth/signup');
    if (!url) {
      throw new Error('API URL not configured. Cannot register.');
    }
    
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': this.csrfToken || '',
    });
    return firstValueFrom(
      this.http.post<any>(
        url,
        { username, email, password },
        { headers, withCredentials: true }
      )
    );
  }
}


