import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

/* =======================
   MODELS / INTERFACES
======================= */

export interface Address {
  _id?: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';   // ✅ IMPORTANT
  addresses?: Address[];
  createdAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

/* =======================
   SERVICE
======================= */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /* =======================
     GETTERS
  ======================= */

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  /* =======================
     AUTH
  ======================= */

  register(userData: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(map(response => {
        if (response.success && response.user && response.token) {
          this.setSession(response);
        }
        return response;
      }));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(map(response => {
        if (response.success && response.user && response.token) {
          this.setSession(response);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /* =======================
     PROFILE
  ======================= */

  getProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/profile`);
  }

  updateProfile(userData: any): Observable<AuthResponse> {
    return this.http
      .put<AuthResponse>(`${this.apiUrl}/auth/profile`, userData)
      .pipe(map(response => {
        if (response.success && response.user) {
          this.updateUser(response.user);
        }
        return response;
      }));
  }

  /* =======================
     ADDRESSES
  ======================= */

  addAddress(address: Address): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/addresses`, address)
      .pipe(map(response => {
        if (response.success && response.user) {
          this.updateUser(response.user);
        }
        return response;
      }));
  }

  updateAddress(addressId: string, address: Address): Observable<AuthResponse> {
    return this.http
      .put<AuthResponse>(`${this.apiUrl}/auth/addresses/${addressId}`, address)
      .pipe(map(response => {
        if (response.success && response.user) {
          this.updateUser(response.user);
        }
        return response;
      }));
  }

  deleteAddress(addressId: string): Observable<AuthResponse> {
    return this.http
      .delete<AuthResponse>(`${this.apiUrl}/auth/addresses/${addressId}`)
      .pipe(map(response => {
        if (response.success && response.user) {
          this.updateUser(response.user);
        }
        return response;
      }));
  }

  /* =======================
     PASSWORD
  ======================= */

  changePassword(oldPassword: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/change-password`, {
      oldPassword,
      newPassword
    });
  }

  requestPasswordReset(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/reset-password`, {
      token,
      newPassword
    });
  }

  /* =======================
     TOKEN
  ======================= */

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /* =======================
     HELPERS
  ======================= */

  private setSession(response: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    localStorage.setItem('token', response.token!);
    this.currentUserSubject.next(response.user!);
  }

  private updateUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
