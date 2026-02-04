import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment'; 

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Login user
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(response => {
        if (response.success && response.token && response.user) {
          // Store token and user info
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        return response;
      }));
  }

  /**
   * Register new user
   */
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      name,
      email,
      password
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
    // Navigate to login
    this.router.navigate(['/admin/login']);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expiry) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'admin';
  }

  /**
   * Verify token with backend
   */
  verifyToken(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verify`);
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  /**
   * Get user profile
   */
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  /**
   * Update user profile
   */
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, data);
  }
}