import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';
  
  // Login form
  loginForm = {
    email: '',
    password: ''
  };

  // Register form
  registerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  // States
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  returnUrl = '';

  // Errors
  errors: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from route parameters or default to checkout
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/checkout';

    // If user is already logged in, redirect
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]);
    }
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.errors = {};
  }

  validateLoginForm(): boolean {
    this.errors = {};
    let isValid = true;

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.loginForm.email.trim()) {
      this.errors.loginEmail = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.loginForm.email)) {
      this.errors.loginEmail = 'Invalid email format';
      isValid = false;
    }

    // Password
    if (!this.loginForm.password) {
      this.errors.loginPassword = 'Password is required';
      isValid = false;
    }

    return isValid;
  }

  validateRegisterForm(): boolean {
    this.errors = {};
    let isValid = true;

    // First name
    if (!this.registerForm.firstName.trim()) {
      this.errors.firstName = 'First name is required';
      isValid = false;
    }

    // Last name
    if (!this.registerForm.lastName.trim()) {
      this.errors.lastName = 'Last name is required';
      isValid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.registerForm.email.trim()) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.registerForm.email)) {
      this.errors.email = 'Invalid email format';
      isValid = false;
    }

    // Phone
    if (!this.registerForm.phone.trim()) {
      this.errors.phone = 'Phone number is required';
      isValid = false;
    }

    // Password
    if (!this.registerForm.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    } else if (this.registerForm.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password
    if (!this.registerForm.confirmPassword) {
      this.errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    return isValid;
  }

  login(): void {
    if (!this.validateLoginForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Login successful! Redirecting...';
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 1000);
          } else {
            this.errorMessage = response.message || 'Login failed';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        }
      });
  }

  register(): void {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      firstName: this.registerForm.firstName,
      lastName: this.registerForm.lastName,
      email: this.registerForm.email,
      phone: this.registerForm.phone,
      password: this.registerForm.password
    };

    this.authService.register(userData)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Account created successfully! Redirecting...';
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 1000);
          } else {
            this.errorMessage = response.message || 'Registration failed';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          console.error('Register error:', error);
        }
      });
  }
}