import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {

  // Form fields
  email: string = '';
  password: string = '';

  // UI state
  showPassword: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.redirectIfAdminLoggedIn();
  }

  /**
   * Redirect admin users already logged in
   */
  private redirectIfAdminLoggedIn(): void {
    if (this.authService.isLoggedIn) {
      const user = this.authService.currentUserValue;

      if (user && user.role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      }
    }
  }

  /**
   * Toggle password visibility
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handle login submission
   */
  onSubmit(): void {
    if (this.isLoading) return;

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (!res?.success) {
          this.errorMessage = res?.message || 'Login failed';
          return;
        }

        // Admin access check
        if (res.user?.role !== 'admin') {
          this.errorMessage = 'Access denied. Admin account required.';
          this.authService.logout();
          return;
        }

        // Success
        this.router.navigate(['/admin/dashboard']);
      },

      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}